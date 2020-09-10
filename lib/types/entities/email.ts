import { TDate } from "timeago.js"

export type EmailType = {
  id?: string,
  to: string,
  cc: string,
  bcc: string,
  from: string,
  text: string,
  subject: string,
  html: string,
  createdAt: TDate
}

export type EmailCreationType = {
  to: string,
  from: string,
  subject: string,
  text: string
}