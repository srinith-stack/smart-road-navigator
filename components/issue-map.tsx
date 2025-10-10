"use client"

import type React from "react"

import { useEffect, useRef } from "react"

type ReportType = "pothole" | "construction" | "flood" | "lowlight" | "accident"

export type IssueReport = {
  id: string
  type: ReportType
  status: "pending" | "verified" | "rejected"
  position: [number, number] // [lat, lng]
  photoUrl?: string
  createdAt: number
}

type PolylineSpec = {
  positions: Array<[number, number]>
  color?: string
  weight?: number
  dashArray?: string
}

type IssueMapProps = {
  reports: IssueReport[]
  heightClass?: string
  children?: React.ReactNode
  polylines?: PolylineSpec[] // new prop
}

function colorFor(t: ReportType) {
  switch (t) {
    case "pothole":
      return "#ef4444" // red
    case "construction":
      return "#f59e0b" // orange
    case "flood":
      return "#3b82f6" // blue
    case "lowlight":
      return "#6b7280" // gray
    case "accident":
      return "#e11d48" // rose
    default:
      return "#111827"
  }
}

export default function IssueMap({ reports, heightClass = "h-[70dvh]", children, polylines = [] }: IssueMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markersLayerRef = useRef<any>(null)
  const linesLayerRef = useRef<any>(null) // layer for polylines

  // Telangana bounds and Hyderabad center
  const center: [number, number] = [17.385, 78.4867]
  const bounds: [[number, number], [number, number]] = [
    [15.8, 77.0],
    [19.6, 81.3],
  ]

  useEffect(() => {
    function ensureLeaflet(): Promise<void> {
      return new Promise((resolve) => {
        const w = window as any
        if (w.L) return resolve()
        // CSS
        const cssId = "leaflet-css-cdn"
        if (!document.getElementById(cssId)) {
          const link = document.createElement("link")
          link.id = cssId
          link.rel = "stylesheet"
          link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          link.crossOrigin = ""
          document.head.appendChild(link)
        }
        // JS
        const jsId = "leaflet-js-cdn"
        if (document.getElementById(jsId)) {
          const existing = document.getElementById(jsId) as HTMLScriptElement
          if ((window as any).L) return resolve()
          existing.addEventListener("load", () => resolve())
          return
        }
        const script = document.createElement("script")
        script.id = jsId
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
        script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
        script.crossOrigin = ""
        script.async = true
        script.onload = () => resolve()
        document.body.appendChild(script)
      })
    }

    let disposed = false

    async function init() {
      await ensureLeaflet()
      if (disposed || !containerRef.current) return
      const L = (window as any).L
      if (!L) return

      const map = L.map(containerRef.current, {
        center,
        zoom: 10,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        scrollWheelZoom: true,
      })
      mapRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/" rel="noreferrer" target="_blank">OpenStreetMap</a> contributors',
      }).addTo(map)

      markersLayerRef.current = L.layerGroup().addTo(map)
      linesLayerRef.current = L.layerGroup().addTo(map) // init polyline layer

      drawMarkers(reports)
      drawPolylines(polylines)
    }

    function drawMarkers(list: IssueReport[]) {
      const L = (window as any).L
      if (!L || !markersLayerRef.current) return
      markersLayerRef.current.clearLayers()
      list.forEach((r) => {
        const color = colorFor(r.type)
        const marker = (window as any).L.circleMarker(r.position, {
          radius: 9,
          color,
          fillColor: color,
          fillOpacity: 0.6,
          weight: 2,
        })
        marker.bindTooltip(
          `<div style="font-size:12px;">
            <div style="font-weight:600;text-transform:capitalize;">${r.type}</div>
            <div>Status: ${r.status}</div>
            <div>${r.position[0].toFixed(4)}, ${r.position[1].toFixed(4)}</div>
          </div>`,
          { sticky: true },
        )
        marker.addTo(markersLayerRef.current)
      })
    }

    function drawPolylines(lines: PolylineSpec[]) {
      const L = (window as any).L
      if (!L || !linesLayerRef.current) return
      linesLayerRef.current.clearLayers()
      lines.forEach((line) => {
        const pl = L.polyline(line.positions, {
          color: line.color || "#2563eb",
          weight: line.weight ?? 5,
          dashArray: line.dashArray,
        })
        pl.addTo(linesLayerRef.current)
      })
    }

    init()

    return () => {
      disposed = true
      try {
        if (mapRef.current) {
          mapRef.current.remove()
          mapRef.current = null
        }
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Redraw markers when reports change
  useEffect(() => {
    const L = (window as any).L
    if (!L || !markersLayerRef.current) return
    markersLayerRef.current.clearLayers()
    reports.forEach((r) => {
      const color = colorFor(r.type)
      const m = L.circleMarker(r.position, {
        radius: 9,
        color,
        fillColor: color,
        fillOpacity: 0.6,
        weight: 2,
      })
      m.bindTooltip(
        `<div style="font-size:12px;">
          <div style="font-weight:600;text-transform:capitalize;">${r.type}</div>
          <div>Status: ${r.status}</div>
          <div>${r.position[0].toFixed(4)}, ${r.position[1].toFixed(4)}</div>
        </div>`,
        { sticky: true },
      )
      m.addTo(markersLayerRef.current)
    })
  }, [reports])

  useEffect(() => {
    const L = (window as any).L
    if (!L || !linesLayerRef.current) return
    linesLayerRef.current.clearLayers()
    polylines.forEach((line) => {
      const pl = (window as any).L.polyline(line.positions, {
        color: line.color || "#2563eb",
        weight: line.weight ?? 5,
        dashArray: line.dashArray,
      })
      pl.addTo(linesLayerRef.current)
    })
  }, [polylines])

  return (
    <div className={heightClass + " w-full"}>
      <div ref={containerRef} className="h-full w-full rounded-md overflow-hidden border" />
      {children}
    </div>
  )
}
