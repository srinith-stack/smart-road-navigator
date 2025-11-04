"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-gradient-to-b from-background to-muted/30">
      <header className="border-b border-border/50 backdrop-blur-sm sticky top-0 z-50 bg-background/95">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="font-bold text-lg tracking-tight text-foreground hover:text-primary transition-colors"
          >
            🛣️ Smart Road Navigator
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              About
            </Link>
            <Link href="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Help
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
            <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link href="/auth">Sign In</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/admin/login">Admin</Link>
            </Button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 md:py-24 grid gap-12 lg:grid-cols-2 items-center">
        <div className="flex flex-col gap-8">
          <div>
            <p className="text-sm font-semibold text-primary mb-3 uppercase tracking-wide">Safe Navigation</p>
            <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight text-balance mb-4">
              Drive Safe, Drive Smart.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Navigate with confidence using real-time road quality detection, crowdsourced hazard reports, and
              AI-powered route suggestions. Your community's safety, your peace of mind.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg" className="rounded-lg">
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-lg bg-transparent">
              <Link href="/navigate">Plan Your Route</Link>
            </Button>
          </div>

          <div className="pt-8 flex items-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Real-time Alerts</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span>Community Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span>Smart Routes</span>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-2 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 rounded-2xl blur-2xl"></div>
          <div className="relative rounded-2xl border border-border/50 overflow-hidden bg-card shadow-lg">
            <Image
              src={"/images/logo-mark.jpg"}
              alt="Smart Road Navigator"
              width={640}
              height={480}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 sm:px-6 py-16 border-t border-border/50">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="rounded-lg border border-border/50 p-6 bg-card/50 hover:bg-card transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-xl">🗺️</div>
            <h3 className="font-semibold text-foreground mb-2">Smart Routing</h3>
            <p className="text-sm text-muted-foreground">
              Get the safest and most efficient routes based on real-time road conditions.
            </p>
          </div>
          <div className="rounded-lg border border-border/50 p-6 bg-card/50 hover:bg-card transition-colors">
            <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 text-xl">🚨</div>
            <h3 className="font-semibold text-foreground mb-2">Report Issues</h3>
            <p className="text-sm text-muted-foreground">
              Instantly report potholes, floods, and hazards to help your community.
            </p>
          </div>
          <div className="rounded-lg border border-border/50 p-6 bg-card/50 hover:bg-card transition-colors">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 text-xl">👥</div>
            <h3 className="font-semibold text-foreground mb-2">Community Powered</h3>
            <p className="text-sm text-muted-foreground">
              Benefit from crowdsourced data to make better driving decisions.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
