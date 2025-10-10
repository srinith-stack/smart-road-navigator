"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { useReports } from "@/components/use-reports"

export default function ReportForm() {
  const router = useRouter()
  const { addReport } = useReports()
  const [type, setType] = useState("pothole")
  const [photo, setPhoto] = useState<File | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const position: [number, number] = [17.385 + Math.random() * 0.04 - 0.02, 78.4867 + Math.random() * 0.04 - 0.02]
      await addReport({
        type: type as any,
        photoUrl: photo ? URL.createObjectURL(photo) : undefined,
        position,
      })
      router.push("/dashboard")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Report an issue</CardTitle>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label>Issue type</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pothole">Pothole</SelectItem>
                <SelectItem value="crack">Crack</SelectItem>
                <SelectItem value="flood">Flood</SelectItem>
                <SelectItem value="lowlight">Low Light</SelectItem>
                <SelectItem value="accident">Accident</SelectItem>
                <SelectItem value="construction">Road Construction</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="photo">Photo (optional)</Label>
            <Input id="photo" type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)} />
          </div>
        </CardContent>
        <CardFooter className="gap-2">
          <Button type="submit" disabled={submitting}>
            Send Report
          </Button>
          <Button type="button" variant="secondary" onClick={() => history.back()}>
            Cancel
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
