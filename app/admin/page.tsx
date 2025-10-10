"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import IssueMap from "@/components/issue-map"
import { useReports } from "@/components/use-reports"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboardPage() {
  const { reports, setReports } = useReports()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    setIsAdmin(localStorage.getItem("srn_admin") === "true")
  }, [])

  const pending = useMemo(() => reports.filter((r) => r.status === "pending"), [reports])

  if (!isAdmin) {
    return (
      <main className="min-h-dvh grid place-items-center p-6">
        <Card>
          <CardHeader>
            <CardTitle>Unauthorized</CardTitle>
          </CardHeader>
          <CardContent>Please login as admin to continue.</CardContent>
        </Card>
      </main>
    )
  }

  function verify(id: string) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "verified" } : r)))
  }
  function reject(id: string) {
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)))
  }

  const verifiedCount = reports.filter((r) => r.status === "verified").length
  const total = reports.length

  return (
    <main className="min-h-dvh grid grid-rows-[auto,auto,1fr]">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="font-semibold">Admin Dashboard</h1>
        </div>
      </header>

      <section className="mx-auto max-w-6xl w-full px-4 py-4 grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total issues</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{total}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Verified</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{verifiedCount}</CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{pending.length}</CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-6xl w-full px-4 py-4 grid gap-6">
        <div className="rounded-lg border overflow-hidden">
          <IssueMap reports={reports.filter((r) => r.status !== "rejected")} heightClass="h-[45dvh]" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User-reported issues</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reports.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.type}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          r.status === "verified" ? "default" : r.status === "pending" ? "secondary" : "destructive"
                        }
                      >
                        {r.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {r.position[0].toFixed(3)}, {r.position[1].toFixed(3)}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button size="sm" onClick={() => verify(r.id)}>
                        Verify
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => reject(r.id)}>
                        Reject
                      </Button>
                      <Button size="sm" variant="ghost" disabled>
                        {" "}
                        Edit info{" "}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {reports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No reports yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </main>
  )
}
