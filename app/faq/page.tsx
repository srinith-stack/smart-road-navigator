export const metadata = {
  title: "FAQ • Smart Road Navigator",
  description: "Frequently asked questions about pothole detection, data privacy, and how Smart Road Navigator works.",
}

export default function FAQPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 space-y-8">
      <header className="space-y-2">
        <h1 className="text-balance text-3xl font-semibold">Frequently Asked Questions</h1>
        <p className="text-muted-foreground">
          Find answers about how detections work, what data we collect, and how you can contribute better reports.
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">How do you detect potholes and road hazards?</h2>
        <p className="text-muted-foreground">
          We combine crowdsourced reports with anonymized sensor patterns (e.g., accelerometer spikes) during active
          navigation. Multiple independent signals increase confidence before a location is flagged to other drivers.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">What regions are supported?</h2>
        <p className="text-muted-foreground">
          The current demo focuses on India with a Telangana map view centered around Hyderabad. You can still submit
          reports anywhere; they will be stored locally for the demo and shown when you view the dashboard.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">What data do you collect?</h2>
        <p className="text-muted-foreground">
          For this demo, reports are stored locally in your browser (no server). In a production setup, we collect only
          the minimum data necessary to improve road safety: approximate location of hazards, timestamps, and anonymized
          sensor summaries during navigation sessions you explicitly opt into.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">How do I opt out of sensors or location?</h2>
        <p className="text-muted-foreground">
          You can disable sensor and location permissions at any time from your browser or device settings. The app will
          continue to work for browsing reports, but live detection and contribution will be limited.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-medium">Is my data sold or shared?</h2>
        <p className="text-muted-foreground">
          No. Hazard data is used strictly to improve route safety and for aggregate statistics. Personally identifying
          information is neither collected nor sold in this demo.
        </p>
      </section>
    </main>
  )
}
