"use client"

import useSWR from "swr"
import { useCallback } from "react"
import type { IssueReport } from "@/lib/types"

const STORAGE_KEY = "srn_reports_v1"

const seed: IssueReport[] = [
  // Hyderabad core
  { id: "hyd-1", type: "pothole", status: "verified", position: [17.385, 78.4867], createdAt: Date.now() - 86400000 },
  {
    id: "hyd-2",
    type: "construction",
    status: "verified",
    position: [17.4005, 78.485],
    createdAt: Date.now() - 7200000,
  },
  { id: "hyd-3", type: "flood", status: "verified", position: [17.395, 78.5], createdAt: Date.now() - 3600000 },
  { id: "hyd-4", type: "lowlight", status: "verified", position: [17.38, 78.47], createdAt: Date.now() - 1800000 },
  // Ring Road area
  { id: "orr-1", type: "pothole", status: "verified", position: [17.45, 78.4], createdAt: Date.now() - 5400000 },
  { id: "orr-2", type: "accident", status: "verified", position: [17.33, 78.6], createdAt: Date.now() - 2700000 },
  // New types in seed
  { id: "hyd-5", type: "crack", status: "verified", position: [17.41, 78.51], createdAt: Date.now() - 2500000 },
  { id: "hyd-6", type: "speedbreaker", status: "verified", position: [17.37, 78.49], createdAt: Date.now() - 2200000 },
  { id: "hyd-7", type: "blockage", status: "verified", position: [17.39, 78.475], createdAt: Date.now() - 2000000 },
  { id: "hyd-8", type: "debris", status: "verified", position: [17.36, 78.505], createdAt: Date.now() - 1800000 },
  { id: "hyd-9", type: "signal", status: "verified", position: [17.43, 78.49], createdAt: Date.now() - 1500000 },
  { id: "hyd-10", type: "signage", status: "verified", position: [17.35, 78.52], createdAt: Date.now() - 1200000 },
  { id: "hyd-11", type: "pothole", status: "verified", position: [17.442, 78.391], createdAt: Date.now() - 1100000 },
  { id: "hyd-12", type: "accident", status: "verified", position: [17.429, 78.408], createdAt: Date.now() - 900000 },
  {
    id: "hyd-13",
    type: "construction",
    status: "verified",
    position: [17.365, 78.548],
    createdAt: Date.now() - 800000,
  },
  { id: "hyd-14", type: "flood", status: "verified", position: [17.33, 78.52], createdAt: Date.now() - 700000 },
  { id: "rr-3", type: "speedbreaker", status: "verified", position: [17.5, 78.35], createdAt: Date.now() - 600000 },
  { id: "rr-4", type: "blockage", status: "verified", position: [17.29, 78.62], createdAt: Date.now() - 500000 },
  { id: "khm-1", type: "signage", status: "verified", position: [17.247, 80.151], createdAt: Date.now() - 400000 }, // Khammam
  { id: "kdm-1", type: "debris", status: "verified", position: [17.26, 78.27], createdAt: Date.now() - 300000 }, // Vikarabad side
]

function readReports(): IssueReport[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      return seed
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : seed
  } catch {
    return seed
  }
}

function writeReports(data: IssueReport[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function useReports() {
  const { data, mutate } = useSWR<IssueReport[]>("reports", async () => readReports(), {
    revalidateOnFocus: false,
    fallbackData: seed,
  })

  const setReports = useCallback(
    (updater: (prev: IssueReport[]) => IssueReport[]) => {
      const next = updater(data || [])
      writeReports(next)
      mutate(next, false)
    },
    [data, mutate],
  )

  const addReport = useCallback(
    async (input: { type: IssueReport["type"]; position: [number, number]; photoUrl?: string }) => {
      const report: IssueReport = {
        id: crypto.randomUUID(),
        type: input.type,
        status: "pending",
        position: input.position,
        photoUrl: input.photoUrl,
        createdAt: Date.now(),
      }
      setReports((prev) => [report, ...prev])
    },
    [setReports],
  )

  return {
    reports: data || seed,
    setReports,
    addReport,
  }
}
