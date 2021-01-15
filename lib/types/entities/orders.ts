import { TDate } from "timeago.js"

export type OrderProductType = {
  productId: string,
  amount: number,
  price: number,
  variant?: string,
}

export type OrderType = {
  id?: string,
  buyerId: string,
  sellerId: string,
  status: string,
  updatedAt?: TDate,
  createdAt?: TDate,
  paymentId?: string,
  paymentStatus?: string,
  products: OrderProductType[]
}