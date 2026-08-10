import { Session } from "next-auth"
import { JWT } from "next-auth/jwt"

export interface CustomSession extends Session {
  user: {
    id: string
    email: string
    name: string
    role: "CREATOR" | "BRAND" | "ADMIN"
    image?: string
  }
}

export interface CustomJWT extends JWT {
  id: string
  role: "CREATOR" | "BRAND" | "ADMIN"
}

export type Platform = "TIKTOK" | "INSTAGRAM" | "FACEBOOK"
export type CampaignStatus = "ACTIVE" | "COMPLETED" | "PAUSED" | "DRAFT"
export type SubmissionStatus = "PENDING" | "APPROVED" | "DENIED"
export type EarningStatus = "PENDING" | "PAID" | "FROZEN"
export type Role = "CREATOR" | "BRAND" | "ADMIN"
