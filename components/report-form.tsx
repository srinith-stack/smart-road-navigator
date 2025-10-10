"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useReports } from "@/components/use-reports"

export default function ReportForm() {
  const router = useRouter()
  const { addReport } = useReports()
  const [type, setType] = useState("pothole")
  const [photo, setPhoto] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [position, setPosition] = useState<[number, number] | null>(null)
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)

  useEffect(() => {
    let disposed = false
    const center: [number, number] = [17.385, 78.4867] // Hyderabad
    const bounds: [[number, number], [number, number]] = [
      [15.8, 77.0],
      [19.6, 81.3],
    ]

    function ensureLeaflet(): Promise<void> {
      return new Promise((resolve) => {
        const w = window as any
        if (w.L) return resolve()
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
        const jsId = "leaflet-js-cdn"
        const existing = document.getElementById(jsId) as HTMLScriptElement | null
        if (existing) {
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

    async function init() {
      await ensureLeaflet()
      if (disposed || !mapContainerRef.current) return
      const L = (window as any).L
      if (!L) return

      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 11,
        maxBounds: bounds,
        maxBoundsViscosity: 1.0,
        scrollWheelZoom: true,
      })
      mapRef.current = map

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/" rel="noreferrer" target="_blank">OpenStreetMap</a> contributors',
      }).addTo(map)

      map.on("click", (e: any) => {
        const nextPos: [number, number] = [e.latlng.lat, e.latlng.lng]
        setPosition(nextPos)
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
  }, [])

  useEffect(() => {
    const L = (window as any).L
    const map = mapRef.current
    if (!L || !map) return
    if (!position) {
      if (markerRef.current) {
        markerRef.current.remove()
        markerRef.current = null
      }
      return
    }
    const color = "#ef4444"
    if (!markerRef.current) {
      markerRef.current = L.circleMarker(position, {
        radius: 9,
        color,
        fillColor: color,
        fillOpacity: 0.6,
        weight: 2,
      }).addTo(map)
    } else {
      markerRef.current.setLatLng(position)
    }
    map.setView(position, Math.max(map.getZoom(), 12))
  }, [position])

  async function useCurrentLocation() {
    if (!("geolocation" in navigator)) {
      alert("Geolocation is not available in your browser.")
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude])
      },
      () => {
        alert("Unable to fetch your location. Please pick on the map.")
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (!position) {
        alert("Please choose a location (use the map or your current location).")
        return
      }
      await addReport({
        type: type as any,
        photoUrl: photo ? URL.createObjectURL(photo) : undefined,
        position,
      })
      router.push("/dashboard")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Issue type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="crack">Crack</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="lowlight">Low Light</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="construction">Road Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Location</Label>
            <div className="flex items-center gap-2">
              <Button type="button" size="sm" onClick={useCurrentLocation}>
                Use current location
              </Button>
              <Button
                type="button"
                size="sm"
                variant="secondary"
                onClick={() => setPosition(null)}
                disabled={!position}
              >
                Clear selection
              </Button>
            </div>
            <div className="rounded-md border overflow-hidden">
              <div ref={mapContainerRef} className="h-60 w-full" />
            </div>
            <p className="text-sm text-muted-foreground">
              {position
                ? `Selected: ${position[0].toFixed(5)}, ${position[1].toFixed(5)}`
                : "Click on the map or use current location to select where the issue is."}
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="photo">Photo (optional)</Label>
            <Input id="photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button type="submit" disabled={submitting || !position}>
            Send Report
          </Button>
          <Button type="button" variant="secondary" onClick={() => history.back()}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
