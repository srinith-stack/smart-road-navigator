"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function PermissionDialog() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const asked = localStorage.getItem("srn_permAsked")
    if (!asked) {
      setOpen(true)
    }
  }, [])

  async function requestPermissions() {
    // Geolocation
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => console.log("[v0] Geolocation OK", pos.coords),
        (err) => console.log("[v0] Geolocation error", err),
      )
    }

    // iOS motion permission
    // @ts-ignore
    if (typeof DeviceMotionEvent !== "undefined" && typeof DeviceMotionEvent.requestPermission === "function") {
      try {
        // @ts-ignore
        const res = await DeviceMotionEvent.requestPermission()
        console.log("[v0] Motion permission:", res)
      } catch (e) {
        console.log("[v0] Motion permission error:", e)
      }
    }

    localStorage.setItem("srn_permAsked", "1")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Allow location and motion sensors</DialogTitle>
          <DialogDescription>
            We use your sensors to detect road quality and keep you safe. You can change this later in your browser
            settings.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Not now
          </Button>
          <Button onClick={requestPermissions}>Allow</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
