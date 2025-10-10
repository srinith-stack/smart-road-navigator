export default function HelpPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold mb-4">Help</h1>
      <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
        <li>Allow location and motion sensors for best results.</li>
        <li>Use “Report Issue” to mark potholes, construction, flood zones, and low-light areas.</li>
        <li>Admins verify reports before they appear to everyone.</li>
      </ul>
    </main>
  )
}
