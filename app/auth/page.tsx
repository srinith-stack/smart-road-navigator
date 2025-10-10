"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DEMO_USERS = [
  { email: "user1@smartroad.in", password: "User@123" },
  { email: "user2@smartroad.in", password: "User@123" },
  { email: "user3@smartroad.in", password: "User@123" },
  { email: "user4@smartroad.in", password: "User@123" },
  { email: "user5@smartroad.in", password: "User@123" },
]

export default function AuthPage() {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (mode === "login") {
        const match = DEMO_USERS.find((u) => u.email === email && u.password === password)
        if (!match) {
          setError("Invalid credentials. Try the demo users below.")
          return
        }
      } else {
        // "Sign up" path just stores the user locally for demo purposes
        DEMO_USERS.push({ email, password })
      }
      localStorage.setItem("srn_auth", JSON.stringify({ email, role: "user" }))
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    setLoading(true)
    setError(null)
    try {
      localStorage.setItem("srn_auth", JSON.stringify({ email: "google-user@example.com", role: "user" }))
      router.push("/dashboard")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-dvh grid place-items-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>{mode === "login" ? "Welcome back" : "Create your account"}</CardTitle>
          <CardDescription>
            {mode === "login"
              ? "Log in to start navigating safer routes."
              : "Join the community improving road safety."}
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form className="grid gap-3" onSubmit={handleEmailAuth}>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={loading}>
              {loading ? "Please wait..." : mode === "login" ? "Log In" : "Sign Up"}
            </Button>
          </form>

          <div className="text-center text-sm text-muted-foreground">or</div>

          <Button variant="secondary" onClick={handleGoogle} disabled={loading}>
            Continue with Google
          </Button>

          <button
            type="button"
            className="text-sm text-primary underline justify-self-start"
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
          >
            {mode === "login" ? "Create an account" : "Already have an account? Log in"}
          </button>
        </CardContent>
        <CardFooter className="flex flex-col items-start gap-1">
          <p className="text-xs text-muted-foreground">Demo user credentials:</p>
          {DEMO_USERS.map((u) => (
            <code key={u.email} className="text-xs">{`${u.email} / ${u.password}`}</code>
          ))}
        </CardFooter>
      </Card>
    </main>
  )
}
