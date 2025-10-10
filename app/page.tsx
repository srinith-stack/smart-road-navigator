"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function HomePage() {
  return (
    <main className="min-h-dvh">
      <header className="border-b">
        <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-lg text-pretty">
            Smart Road Navigator
          </Link>
          <nav className="flex items-center gap-3">
            <Link href="/about" className="text-sm hover:underline">
              About
            </Link>
            <Link href="/help" className="text-sm hover:underline">
              Help
            </Link>
            <Link href="/contact" className="text-sm hover:underline">
              Contact
            </Link>
            <Link href="/faq" className="text-sm hover:underline">
              FAQ
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 grid gap-8 md:grid-cols-2 items-center">
        <div className="flex flex-col gap-6">
          <h1 className="text-4xl md:text-5xl font-semibold text-balance">
            Smart Road Navigator – Drive Safe, Drive Smart.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Detect road quality with your phone sensors and crowdsourced data. Get safer routes, report issues in
            seconds, and help your community drive smarter.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <Link href="/auth">Get Started</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/admin/login">Login as Admin</Link>
            </Button>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="rounded-lg border overflow-hidden">
            {/* Map/road graphic placeholder */}
            <Image
              src={"/placeholder.svg?height=360&width=640&query=abstract%20map%20grid%20with%20roads"}
              alt="Animated map illustration"
              width={640}
              height={360}
              className="w-full h-auto"
            />
          </div>
          <div className="rounded-lg border p-3">
            {/* Faux explainer video area */}
            <div className="aspect-video w-full rounded-md overflow-hidden bg-muted grid place-items-center">
              <Image
                src={"/placeholder.svg?height=360&width=640&query=product%20explainer%20video%20frame"}
                alt="Explainer video placeholder"
                width={640}
                height={360}
              />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Auto-playing explainer video (placeholder). We can embed your video file or YouTube/Vimeo later.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
