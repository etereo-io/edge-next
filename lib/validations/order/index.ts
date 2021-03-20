import { OrderType } from "@lib/types";

export default function validateOrder(order: OrderType): boolean {
  return order.buyerId && order.sellerId  && order.products.length > 0 
}