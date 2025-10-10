export type IssueType =
  | "pothole"
  | "crack"
  | "construction"
  | "flood"
  | "lowlight"
  | "accident"
  | "speedbreaker"
  | "blockage"
  | "debris"
  | "signal"
  | "signage"
export type IssueStatus = "pending" | "verified"

export interface IssueReport {
  id: string
  type: IssueType
  status: IssueStatus
  position: [number, number]
  photoUrl?: string
  createdAt: number
}
