"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import dynamic from "next/dynamic"

export default function NavigateView() {
  const [from, setFrom] = useState("Current Location")
  const [to, setTo] = useState("Downtown Center")
  const [selected, setSelected] = useState<"fastest" | "safest">("safest")

  // Sample Telangana routes (around Hyderabad) to align with your India/Telangana context
  const routes = useMemo(() => {
    const fastest: Array<[number, number]> = [
      [17.385044, 78.486671],
      [17.392, 78.49],
      [17.4, 78.5],
    ]
    const safest: Array<[number, number]> = [
      [17.385044, 78.486671],
      [17.382, 78.495],
      [17.378, 78.505],
      [17.372, 78.515],
    ]
    return { fastest, safest }
  }, [])

  const comparison = {
    fastest: { timeMin: 18, safety: 3.6 },
    safest: { timeMin: 22, safety: 4.3 },
  }

  const DynamicIssueMap = useMemo(() => {
    if (typeof window === "undefined") {
      // Return a no-op component on the server to avoid any evaluation
      return (() => <div className="h-[60dvh] w-full bg-muted" />) as unknown as React.ComponentType<any>
    }
    return dynamic(() => import("@/components/issue-map"), {
      ssr: false,
      loading: () => <div className="h-[60dvh] w-full bg-muted" />,
    })
  }, [])

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
          <DynamicIssueMap
            reports={[]}
            heightClass="h-[60dvh]"
            polylines={[
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
            ]}
          />
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
