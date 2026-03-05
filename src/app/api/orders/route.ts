import { NextRequest, NextResponse } from "next/server";
import { getAllOrders, addOrder, clearAllOrders, deleteOrder, type Order } from "@/lib/store";

export async function GET() {
  const orders = getAllOrders();
  const grandTotal = orders.reduce((sum, o) => sum + o.orderTotal, 0);
  return NextResponse.json({ orders, count: orders.length, grandTotal });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const order: Order = {
      id: crypto.randomUUID(),
      name: body.name?.trim(),
      items: body.items || [],
      specialInstructions: body.specialInstructions?.trim() || "",
      orderTotal: body.orderTotal || 0,
      createdAt: new Date().toISOString(),
    };
    if (!order.name) return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (order.items.length === 0) return NextResponse.json({ error: "At least one item is required" }, { status: 400 });
    addOrder(order);
    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const all = searchParams.get("all");
  if (all === "true") { clearAllOrders(); return NextResponse.json({ success: true, message: "All orders cleared" }); }
  if (id) { const deleted = deleteOrder(id); if (deleted) return NextResponse.json({ success: true }); return NextResponse.json({ error: "Order not found" }, { status: 404 }); }
  return NextResponse.json({ error: "Provide id or all=true" }, { status: 400 });
}
