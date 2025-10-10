"use client"

import type React from "react"
import { useMemo, useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

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
  const [selected, setSelected] = useState<"fastest" | "safest">("safest")
  const [confirmed, setConfirmed] = useState(false)

  const fromList = useMemo(() => {
    const q = from.trim().toLowerCase()
    if (!q) return places.slice(0, 5)
    return places.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6)
  }, [from, places])

  const toList = useMemo(() => {
    const q = to.trim().toLowerCase()
    if (!q) return places.slice(0, 5)
    return places.filter((p) => p.name.toLowerCase().includes(q)).slice(0, 6)
  }, [to, places])

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
  const routes = useMemo(() => {
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
    // fastest: straight-ish line through midpoint
    const fastest: Array<[number, number]> = [fromCoord, mid, toCoord]
    // safest: offset by a tiny amount to simulate detour
    const offset = 0.01
    const safest: Array<[number, number]> = [
      fromCoord,
      [mid[0] - offset, mid[1] + offset],
      [lat2 - offset, lng2 + offset],
      toCoord,
    ]
    return { fastest, safest }
  }, [fromCoord, toCoord])

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

            <div className="flex gap-2 items-start md:items-stretch">
              <Button variant={selected === "fastest" ? "default" : "secondary"} onClick={() => setSelected("fastest")}>
                Fastest
              </Button>
              <Button variant={selected === "safest" ? "default" : "secondary"} onClick={() => setSelected("safest")}>
                Safest
              </Button>
            </div>

            <div className="md:col-span-3 flex items-center justify-between gap-2">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div className={cn("rounded-md border p-3", selected === "fastest" && "ring-2 ring-primary")}>
                  <p className="font-medium">🟢 Fastest Route</p>
                  <p className="text-sm text-muted-foreground">
                    {fromCoord && toCoord ? "Based on your selection" : "Sample route"} • Time: 18 min
                  </p>
                </div>
                <div className={cn("rounded-md border p-3", selected === "safest" && "ring-2 ring-primary")}>
                  <p className="font-medium">🔵 Safest Route</p>
                  <p className="text-sm text-muted-foreground">
                    {fromCoord && toCoord ? "Based on your selection" : "Sample route"} • Safety: 4.3/5
                  </p>
                </div>
              </div>
              <Button onClick={confirmRoute} disabled={!fromCoord || !toCoord}>
                Confirm
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg border overflow-hidden">
          <DynamicIssueMap
            reports={[]}
            heightClass="h-[60dvh]"
            polylines={
              confirmed
                ? [
                    {
                      positions: routes.fastest,
                      color: selected === "fastest" ? "#16a34a" : "#9ca3af",
                      weight: 5,
                    },
                    {
                      positions: routes.safest,
                      color: selected === "safest" ? "#2563eb" : "#9ca3af",
                      weight: 5,
                      dashArray: "6 8",
                    },
                  ]
                : [] // wait for confirmation before drawing
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {confirmed ? "Route confirmed. Voice guidance enabled." : "Pick places and confirm to see the route."}
          </p>
          <Button disabled={!confirmed}>Start Navigation</Button>
        </div>
      </section>
    </main>
  )
}
