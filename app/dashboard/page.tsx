"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import { useReports } from "@/components/use-reports"
import PermissionDialog from "@/components/permission-dialog" // Import PermissionDialog

const DynamicIssueMap = dynamic(() => import("@/components/issue-map"), {
  ssr: false,
  loading: () => <div className="h-[70dvh] w-full bg-muted" />,
})

export default function DashboardPage() {
  const { reports } = useReports()

  return (
    <main className="min-h-dvh grid grid-rows-[auto,1fr]">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <h1 className="font-semibold">Smart Road Navigator</h1>
          <div className="flex items-center gap-2">
            <Link href="/navigate">
              <Button>Start Navigation</Button>
            </Link>
            <Link href="/report">
              <Button variant="secondary">Report Issue</Button>
            </Link>
          </div>
        </div>
      </header>

      <section className="relative">
        <DynamicIssueMap reports={reports.filter((r) => r.status === "verified")} />
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[401]">
          <div className="rounded-full border bg-card shadow px-3 py-2 flex items-center gap-2">
            <Link href="/navigate">
              <Button size="sm">Start Navigation</Button>
            </Link>
            <Link href="/report">
              <Button size="sm" variant="secondary">
                Report Issue
              </Button>
            </Link>
          </div>
        </div>
        <PermissionDialog />
      </section>
    </main>
  )
}
