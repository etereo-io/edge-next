import { TDate } from "timeago.js"

export type EmailType = {
  id?: string,
  to: string | string[],
  cc?: string| string[],
  bcc?: string| string[],
  from: string,
  text: string,
  subject: string,
  html: string,
  createdAt?: TDate
}

export type EmailCreationType = {
  to: string| string[],
  cc?: string| string[],
  bcc?: string| string[],
  from: string,
  subject: string,
  text?: string,
  html?: string
}