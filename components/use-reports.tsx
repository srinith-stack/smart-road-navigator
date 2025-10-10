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
    async (input: { type: IssueReport["type"] | "crack"; position: [number, number]; photoUrl?: string }) => {
      const normalizedType =
        input.type === "crack" ? ("pothole" as IssueReport["type"]) : (input.type as IssueReport["type"])
      const report: IssueReport = {
        id: crypto.randomUUID(),
        type: normalizedType,
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
