"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Polyline } from "react-leaflet"
import type { LatLngExpression } from "leaflet"
import dynamic from "next/dynamic"
import { cn } from "@/lib/utils"

// Dynamic wrapper so we can access Map children types
const DynamicIssueMap = dynamic(() => import("@/components/issue-map"), {
  ssr: false,
  loading: () => <div className="h-[60dvh] w-full bg-muted" />,
})

export default function NavigatePage() {
  const [from, setFrom] = useState("Current Location")
  const [to, setTo] = useState("Downtown Center")
  const [selected, setSelected] = useState<"fastest" | "safest">("safest")

  const routes = useMemo(() => {
    const fastest: LatLngExpression[] = [
      [37.7749, -122.4194],
      [37.7799, -122.4094],
      [37.7849, -122.3994],
    ]
    const safest: LatLngExpression[] = [
      [37.7749, -122.4194],
      [37.773, -122.4094],
      [37.771, -122.401],
      [37.769, -122.395],
      [37.768, -122.39],
    ]
    return { fastest, safest }
  }, [])

  const comparison = {
    fastest: { timeMin: 18, safety: 3.6 },
    safest: { timeMin: 22, safety: 4.3 },
  }

  return (
    <main className="min-h-dvh grid grid-rows-[auto,1fr]">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="font-semibold text-lg">Smart Route</h1>
        </div>
      </header>

      <section className="mx-auto max-w-6xl w-full px-4 py-4 grid gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Plan your route</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-[1fr,1fr,auto]">
            <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="From" />
            <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="To" />
            <div className="flex gap-2">
              <Button variant={selected === "fastest" ? "default" : "secondary"} onClick={() => setSelected("fastest")}>
                Fastest
              </Button>
              <Button variant={selected === "safest" ? "default" : "secondary"} onClick={() => setSelected("safest")}>
                Safest
              </Button>
            </div>

            <div className="md:col-span-3 grid grid-cols-2 gap-3">
              <div className={cn("rounded-md border p-3", selected === "fastest" && "ring-2 ring-primary")}>
                <p className="font-medium">🟢 Fastest Route</p>
                <p className="text-sm text-muted-foreground">Time: {comparison.fastest.timeMin} min</p>
                <p className="text-sm text-muted-foreground">Safety rating: {comparison.fastest.safety.toFixed(1)}/5</p>
              </div>
              <div className={cn("rounded-md border p-3", selected === "safest" && "ring-2 ring-primary")}>
                <p className="font-medium">🔵 Safest Route</p>
                <p className="text-sm text-muted-foreground">Time: {comparison.safest.timeMin} min</p>
                <p className="text-sm text-muted-foreground">Safety rating: {comparison.safest.safety.toFixed(1)}/5</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="rounded-lg border overflow-hidden">
          <DynamicIssueMap reports={[]} heightClass="h-[60dvh]">
            <Polyline
              positions={routes.fastest}
              pathOptions={{ color: selected === "fastest" ? "#16a34a" : "#9ca3af", weight: 5 }}
            />
            <Polyline
              positions={routes.safest}
              pathOptions={{ color: selected === "safest" ? "#2563eb" : "#9ca3af", weight: 5, dashArray: "6 8" }}
            />
          </DynamicIssueMap>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Voice guidance enabled for the selected route. You can switch routes anytime.
          </p>
          <Button>Start Navigation</Button>
        </div>
      </section>
    </main>
  )
}
