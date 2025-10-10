export default function FAQPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-6">
      <h1 className="text-3xl font-semibold">FAQ</h1>

      <section>
        <h2 className="font-medium">How we detect potholes?</h2>
        <p className="text-muted-foreground">
          Aggregated accelerometer spikes and crowdsourced confirmations help identify potholes with higher confidence.
        </p>
      </section>

      <section>
        <h2 className="font-medium">Privacy policy</h2>
        <p className="text-muted-foreground">
          We collect anonymized sensor and approximate location data only when you opt in and navigation is active. Data
          is used to detect hazards and improve route safety and is never sold. You can disable sensor access at any
          time in your browser or device settings.
        </p>
      </section>
    </main>
  )
}
