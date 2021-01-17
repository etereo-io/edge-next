import { TDate } from "timeago.js";

export type ShoppingCartProductType = {
  productId: string,
  productContentType: string,
  sellerId: string,
  amount: number,
  variant: string
}

export type ShoppingCartType = {
  userId: string,
  products: ShoppingCartProductType[]
  createdAt: number
}