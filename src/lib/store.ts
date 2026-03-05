export interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  basePrice: number;
  quantity: number;
  customizations: Record<string, string | string[]>;
  customizationTotal: number;
  itemTotal: number;
}

export interface Order {
  id: string;
  name: string;
  items: OrderItem[];
  specialInstructions: string;
  orderTotal: number;
  createdAt: string;
}

const orders: Map<string, Order> = new Map();

export function getAllOrders(): Order[] {
  return Array.from(orders.values()).sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function addOrder(order: Order): Order {
  orders.set(order.id, order);
  return order;
}

export function deleteOrder(id: string): boolean {
  return orders.delete(id);
}

export function clearAllOrders(): void {
  orders.clear();
}

export function getOrderCount(): number {
  return orders.size;
}

export function getGrandTotal(): number {
  return Array.from(orders.values()).reduce((sum, o) => sum + o.orderTotal, 0);
}
