"use client"

import ReportForm from "@/components/report-form"

export default function ReportPage() {
  return (
    <main className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4">
          <h1 className="font-semibold text-lg">Report an Issue</h1>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-4 py-6">
        <ReportForm />
      </section>
    </main>
  )
}
