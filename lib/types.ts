export type IssueType = "pothole" | "construction" | "flood" | "lowlight" | "accident"
export type IssueStatus = "pending" | "verified"

export interface IssueReport {
  id: string
  type: IssueType
  status: IssueStatus
  position: [number, number]
  photoUrl?: string
  createdAt: number
}
