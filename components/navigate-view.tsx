"use client"

import type React from "react"
import { useMemo, useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"
import { useReports } from "@/components/use-reports"

export default function NavigateView() {
  // Suggested Telangana/Hyderabad places with lat/lng
  const places = useMemo(
    () => [
      { name: "Charminar", coord: [17.3616, 78.4747] as [number, number] },
      { name: "HITEC City", coord: [17.4483, 78.38] as [number, number] },
      { name: "Gachibowli", coord: [17.4401, 78.3489] as [number, number] },
      { name: "Secunderabad Jn", coord: [17.4399, 78.4983] as [number, number] },
      { name: "Shamshabad Airport", coord: [17.2403, 78.4294] as [number, number] },
      { name: "LB Nagar", coord: [17.3376, 78.5522] as [number, number] },
      { name: "Kukatpally", coord: [17.4948, 78.3996] as [number, number] },
      { name: "Banjara Hills", coord: [17.4192, 78.4489] as [number, number] },
      { name: "Madhapur", coord: [17.4474, 78.3762] as [number, number] },
      { name: "Kothagudem", coord: [17.551, 80.6197] as [number, number] }, // Telangana town for variety
    ],
    [],
  )

  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [fromCoord, setFromCoord] = useState<[number, number] | null>(null)
  const [toCoord, setToCoord] = useState<[number, number] | null>(null)
  const [showFromSug, setShowFromSug] = useState(false)
  const [showToSug, setShowToSug] = useState(false)
  const selected = "safest"
  const [confirmed, setConfirmed] = useState(false)
  const [routeSafest, setRouteSafest] = useState<Array<[number, number]>>([])
  const [loadingRoute, setLoadingRoute] = useState(false)
  const [routeError, setRouteError] = useState<string | null>(null)
  const [etaSafestSec, setEtaSafestSec] = useState<number | null>(null)

  const { reports } = useReports()

  // Remote suggestions from Nominatim (Telangana-bounded)
  type RemotePlace = { name: string; display: string; coord: [number, number] }
  const [fromRemote, setFromRemote] = useState<RemotePlace[]>([])
  const [toRemote, setToRemote] = useState<RemotePlace[]>([])
  const telanganaViewbox = "77.0,19.6,81.3,15.8" // left,top,right,bottom

  async function searchPlaces(q: string): Promise<RemotePlace[]> {
    if (!q || q.trim().length < 3) return []
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
      q,
    )}&viewbox=${telanganaViewbox}&bounded=1&countrycodes=in&limit=6`
    const res = await fetch(url, {
      cache: "no-store",
      headers: { "Accept-Language": "en-IN", "User-Agent": "Smart Road Navigator (demo)" },
    })
    if (!res.ok) return []
    const data = (await res.json()) as Array<any>
    return (data || []).map((d) => ({
      name: d.display_name?.split(",")[0] ?? d.name ?? "Unknown",
      display: d.display_name ?? d.name ?? "Unknown",
      coord: [Number.parseFloat(d.lat), Number.parseFloat(d.lon)] as [number, number],
    }))
  }

  // Debounce From search
  useEffect(() => {
    let cancel = false
    const q = from.trim()
    if (q.length < 3) {
      setFromRemote([])
      return
    }
    const id = setTimeout(async () => {
      try {
        const results = await searchPlaces(q)
        if (!cancel) setFromRemote(results)
      } catch {
        if (!cancel) setFromRemote([])
      }
    }, 250)
    return () => {
      cancel = true
      clearTimeout(id)
    }
  }, [from])

  // Debounce To search
  useEffect(() => {
    let cancel = false
    const q = to.trim()
    if (q.length < 3) {
      setToRemote([])
      return
    }
    const id = setTimeout(async () => {
      try {
        const results = await searchPlaces(q)
        if (!cancel) setToRemote(results)
      } catch {
        if (!cancel) setToRemote([])
      }
    }, 250)
    return () => {
      cancel = true
      clearTimeout(id)
    }
  }, [to])

  // Merge local + remote suggestions
  const fromList = useMemo(() => {
    const q = from.trim().toLowerCase()
    const local = !q ? places.slice(0, 5) : places.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 3)
    const remote = fromRemote.map((r) => ({ name: r.name, coord: r.coord as [number, number] }))
    return [...remote, ...local].slice(0, 6)
  }, [from, places, fromRemote])

  const toList = useMemo(() => {
    const q = to.trim().toLowerCase()
    const local = !q ? places.slice(0, 5) : places.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 3)
    const remote = toRemote.map((r) => ({ name: r.name, coord: r.coord as [number, number] }))
    return [...remote, ...local].slice(0, 6)
  }, [to, places, toRemote])

  function pickFrom(p: { name: string; coord: [number, number] }) {
    setFrom(p.name)
    setFromCoord(p.coord)
    setShowFromSug(false)
    setConfirmed(false)
  }

  function pickTo(p: { name: string; coord: [number, number] }) {
    setTo(p.name)
    setToCoord(p.coord)
    setShowToSug(false)
    setConfirmed(false)
  }

  function confirmRoute() {
    if (!fromCoord || !toCoord) return
    setConfirmed(true)
  }

  // Compute demo routes between fromCoord and toCoord (straight line vs offset)
  const fallbackRoutes = useMemo(() => {
    const fallback: Array<[number, number]> = [
      [17.385044, 78.486671],
      [17.392, 78.49],
      [17.4, 78.5],
    ]
    if (!fromCoord || !toCoord) {
      return {
        fastest: fallback,
        safest: [
          [17.385044, 78.486671],
          [17.382, 78.495],
          [17.378, 78.505],
          [17.372, 78.515],
        ] as Array<[number, number]>,
      }
    }
    const [lat1, lng1] = fromCoord
    const [lat2, lng2] = toCoord
    const mid: [number, number] = [(lat1 + lat2) / 2, (lng1 + lng2) / 2]
    const fastest: Array<[number, number]> = [fromCoord, mid, toCoord]
    const offset = 0.01
    const safest: Array<[number, number]> = [
      fromCoord,
      [mid[0] - offset, mid[1] + offset],
      [lat2 - offset, lng2 + offset],
      toCoord,
    ]
    return { fastest, safest }
  }, [fromCoord, toCoord])

  useEffect(() => {
    let abort = false
    type RouteRes = { coords: [number, number][]; durationSec: number; distanceM?: number }

    async function fetchRoutes(
      fromLat: number,
      fromLng: number,
      toLat: number,
      toLng: number,
      opts?: { alternatives?: boolean; exclude?: string },
    ): Promise<RouteRes[]> {
      const bases = [
        "https://router.project-osrm.org/route/v1/driving",
        "https://routing.openstreetmap.de/routed-car/route/v1/driving",
      ]
      const params = new URLSearchParams({
        overview: "full",
        geometries: "geojson",
        alternatives: opts?.alternatives ? "true" : "false",
        annotations: "duration,distance",
      })
      if (opts?.exclude) params.set("exclude", opts.exclude)

      for (const base of bases) {
        try {
          const url = `${base}/${fromLng},${fromLat};${toLng},${toLat}?${params.toString()}`
          const res = await fetch(url, { cache: "no-store" })
          if (!res.ok) continue
          const json = await res.json()
          const routes = (json?.routes ?? []) as Array<{
            duration: number
            distance: number
            geometry: { coordinates: [number, number][] }
          }>
          if (routes.length > 0) {
            return routes.map((r) => ({
              durationSec: r.duration,
              distanceM: r.distance,
              coords: (r.geometry?.coordinates ?? []).map((c) => [c[1], c[0]] as [number, number]),
            }))
          }
        } catch {
          // try next base
        }
      }
      return []
    }

    function pickSafest(cands: RouteRes[]): RouteRes | null {
      if (cands.length === 0) return null
      let best: RouteRes | null = null
      let bestScore = Number.POSITIVE_INFINITY
      for (const r of cands) {
        const score = routeHazardScore(r.coords)
        if (
          score < bestScore ||
          (score === bestScore && best && r.durationSec < best.durationSec) ||
          (score === bestScore && !best)
        ) {
          best = r
          bestScore = score
        }
      }
      return best
    }

    async function run() {
      if (!confirmed || !fromCoord || !toCoord) return
      setLoadingRoute(true)
      setRouteError(null)
      try {
        const [fLat, fLng] = fromCoord
        const [tLat, tLng] = toCoord

        const candidates: RouteRes[] = []

        // Try to get multiple alternatives
        const mainRoutes = await fetchRoutes(fLat, fLng, tLat, tLng, { alternatives: true })
        candidates.push(...mainRoutes)

        // Try excluding motorways (often a different path)
        const excluded = await fetchRoutes(fLat, fLng, tLat, tLng, { exclude: "motorway" })
        candidates.push(...excluded)

        // Deduplicate by geometry length signature to avoid identical routes
        const seen = new Set<string>()
        const unique = candidates.filter((r) => {
          const sig = `${r.coords.length}:${Math.round((r.distanceM || 0) / 10)}:${Math.round(r.durationSec)}`
          if (seen.has(sig)) return false
          seen.add(sig)
          return true
        })

        let safest: RouteRes | null = pickSafest(unique)

        // As a last resort, fallback to approximate (kept for resiliency)
        if (!safest) {
          const approx = fallbackRoutes.safest
          safest = { coords: approx, durationSec: approxETA(approx, 30) }
        }

        if (!abort && safest) {
          setRouteSafest(safest.coords)
          setEtaSafestSec(safest.durationSec ?? null)
        }
      } catch (err: any) {
        if (!abort) {
          setRouteError("Could not fetch road route. Showing approximate path.")
          setRouteSafest(fallbackRoutes.safest)
          setEtaSafestSec(approxETA(fallbackRoutes.safest, 30))
        }
      } finally {
        if (!abort) setLoadingRoute(false)
      }
    }
    run()
    return () => {
      abort = true
    }
  }, [confirmed, fromCoord, toCoord, fallbackRoutes, reports])

  // Live navigation via Geolocation.watchPosition
  const [navigating, setNavigating] = useState(false)
  const [currentLoc, setCurrentLoc] = useState<[number, number] | null>(null)
  const watchIdRef = useRef<number | null>(null)

  function startNavigation() {
    if (!confirmed) return
    if (!navigator.geolocation) return
    if (watchIdRef.current != null) return
    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setCurrentLoc([pos.coords.latitude, pos.coords.longitude])
      },
      () => {
        // fail silently
      },
      { enableHighAccuracy: true, maximumAge: 10_000, timeout: 10_000 },
    )
    watchIdRef.current = id
    setNavigating(true)
  }

  function stopNavigation() {
    if (watchIdRef.current != null && navigator.geolocation) {
      navigator.geolocation.clearWatch(watchIdRef.current)
    }
    watchIdRef.current = null
    setNavigating(false)
  }

  const DynamicIssueMap = useMemo(() => {
    if (typeof window === "undefined") {
      return (() => <div className="h-[60dvh] w-full bg-muted" />) as unknown as React.ComponentType<any>
    }
    return dynamic(() => import("@/components/issue-map"), {
      ssr: false,
      loading: () => <div className="h-[60dvh] w-full bg-muted" />,
    })
  }, [])

  // Close suggestions when clicking outside
  const wrapRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!wrapRef.current) return
      if (!wrapRef.current.contains(e.target as Node)) {
        setShowFromSug(false)
        setShowToSug(false)
      }
    }
    document.addEventListener("mousedown", onDocClick)
    return () => document.removeEventListener("mousedown", onDocClick)
  }, [])

  function formatETA(sec: number | null) {
    if (sec == null) return "—"
    const minutes = Math.round(sec / 60)
    if (minutes < 60) return `${minutes} min`
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return `${h} hr ${m} min`
  }

  function haversineMeters(a: [number, number], b: [number, number]) {
    const R = 6371000
    const toRad = (x: number) => (x * Math.PI) / 180
    const dLat = toRad(b[0] - a[0])
    const dLng = toRad(b[1] - a[1])
    const lat1 = toRad(a[0])
    const lat2 = toRad(b[0])
    const sinDLat = Math.sin(dLat / 2)
    const sinDLng = Math.sin(dLng / 2)
    const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng
    return 2 * R * Math.asin(Math.sqrt(h))
  }

  function polylineMeters(coords: Array<[number, number]>) {
    let sum = 0
    for (let i = 1; i < coords.length; i++) {
      sum += haversineMeters(coords[i - 1], coords[i])
    }
    return sum
  }

  function approxETA(coords: Array<[number, number]>, speedKph: number) {
    const m = polylineMeters(coords)
    const km = m / 1000
    const hours = km / speedKph
    return Math.round(hours * 3600)
  }

  // Consider these report types as hazards to avoid
  const hazardTypes = new Set(["pothole", "accident", "flood", "blockage", "debris", "speedbreaker"])
  const hazardPoints = reports.filter((r) => hazardTypes.has(r.type)).map((r) => r.position)

  function routeHazardScore(coords: [number, number][]) {
    if (hazardPoints.length === 0 || coords.length === 0) return 0
    // Sample every Nth point to keep it fast
    const step = Math.max(1, Math.floor(coords.length / 200))
    let score = 0
    for (let i = 0; i < coords.length; i += step) {
      const p = coords[i]
      for (let j = 0; j < hazardPoints.length; j++) {
        const d = haversineMeters(p, hazardPoints[j] as [number, number])
        if (d < 50) {
          // within 50m of a hazard point
          score += 1
          break
        }
      }
    }
    return score
  }

  return (
    <main className="min-h-dvh grid grid-rows-[auto,1fr]">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="font-semibold text-lg">Smart Route</h1>
        </div>
      </header>

      <section className="mx-auto max-w-6xl w-full px-4 py-4 grid gap-4" ref={wrapRef}>
        <Card>
          <CardHeader>
            <CardTitle>Plan your route</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
            <div className="relative">
              <Input
                value={from}
                onChange={(e) => {
                  setFrom(e.target.value)
                  setShowFromSug(true)
                }}
                onFocus={() => setShowFromSug(true)}
                placeholder="From (e.g., Charminar)"
                aria-autocomplete="list"
                aria-expanded={showFromSug}
              />
              {showFromSug && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow">
                  {fromList.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No matches</div>
                  ) : (
                    fromList.map((p) => (
                      <button
                        key={`from-${p.name}`}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                        onClick={() => pickFrom(p)}
                      >
                        {p.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <div className="relative">
              <Input
                value={to}
                onChange={(e) => {
                  setTo(e.target.value)
                  setShowToSug(true)
                }}
                onFocus={() => setShowToSug(true)}
                placeholder="To (e.g., HITEC City)"
                aria-autocomplete="list"
                aria-expanded={showToSug}
              />
              {showToSug && (
                <div className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow">
                  {toList.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-muted-foreground">No matches</div>
                  ) : (
                    toList.map((p) => (
                      <button
                        key={`to-${p.name}`}
                        type="button"
                        className="w-full text-left px-3 py-2 text-sm hover:bg-muted"
                        onClick={() => pickTo(p)}
                      >
                        {p.name}
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* <div className="flex gap-2 items-start md:items-stretch">
              <Button variant={selected === "fastest" ? "default" : "secondary"} onClick={() => setSelected("fastest")}>
                Fastest
              </Button>
              <Button variant={selected === "safest" ? "default" : "secondary"} onClick={() => setSelected("safest")}>
                Safest
              </Button>
            </div> */}

            <div className="md:col-span-3 flex items-center justify-between gap-2">
              <div className="grid grid-cols-2 gap-3 flex-1">
                {/* <div className={cn("rounded-md border p-3", selected === "fastest" && "ring-2 ring-primary")}>
                  <p className="font-medium">🟢 Fastest Route</p>
                  <p className="text-sm text-muted-foreground">
                    {fromCoord && toCoord ? "Based on your selection" : "Sample route"} • Time:{" "}
                    {formatETA(etaFastestSec)}
                  </p>
                </div> */}
                <div className={cn("rounded-md border p-3", true && "ring-2 ring-primary")}>
                  <p className="font-medium">🔵 Safest Route</p>
                  <p className="text-sm text-muted-foreground">
                    {fromCoord && toCoord ? "Based on your selection" : "Sample route"} • Time:{" "}
                    {formatETA(etaSafestSec)}
                  </p>
                </div>
              </div>
              <Button onClick={confirmRoute} disabled={!fromCoord || !toCoord}>
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>

        {routeError ? <p className="text-sm text-destructive">{routeError}</p> : null}
        {loadingRoute && confirmed ? <p className="text-sm text-muted-foreground">Fetching route…</p> : null}

        <div className="rounded-lg border overflow-hidden">
          <DynamicIssueMap
            reports={reports}
            heightClass="h-[60dvh]"
            polylines={
              confirmed
                ? [
                    {
                      positions: routeSafest.length ? routeSafest : fallbackRoutes.safest,
                      color: "#2563eb",
                      weight: 5,
                      dashArray: "6 8",
                    },
                  ]
                : []
            }
            currentLocation={currentLoc ?? undefined}
            followCurrent={navigating}
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {confirmed ? "Route confirmed. Voice guidance enabled." : "Pick places and confirm to see the route."}
          </p>
          {navigating ? (
            <Button onClick={stopNavigation}>Stop Navigation</Button>
          ) : (
            <Button onClick={startNavigation} disabled={!confirmed}>
              Start Navigation
            </Button>
          )}
        </div>
      </section>
    </main>
  )
}
