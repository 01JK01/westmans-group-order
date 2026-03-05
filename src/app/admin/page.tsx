"use client";

import { useState, useEffect, useCallback } from "react";

interface OrderItem {
  menuItemId: string;
  menuItemName: string;
  basePrice: number;
  quantity: number;
  customizations: Record<string, string | string[]>;
  customizationTotal: number;
  itemTotal: number;
}

interface Order {
  id: string;
  name: string;
  items: OrderItem[];
  specialInstructions: string;
  orderTotal: number;
  createdAt: string;
}

function formatPrice(n: number): string { return `$${n.toFixed(2)}`; }
function formatCustomization(val: string | string[]): string { if (Array.isArray(val)) return val.join(", "); return val; }
function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, month: "short", day: "numeric" });
}

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const PIN_CODE = "1234";

  const fetchOrders = useCallback(async () => {
    try { setLoading(true); const res = await fetch("/api/orders"); const data = await res.json(); setOrders(data.orders || []); setGrandTotal(data.grandTotal || 0); }
    catch (err) { console.error("Failed to fetch orders", err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!authenticated) return; fetchOrders();
    if (!autoRefresh) return; const interval = setInterval(fetchOrders, 5000); return () => clearInterval(interval);
  }, [authenticated, autoRefresh, fetchOrders]);

  const handleDeleteOrder = async (id: string) => { if (!confirm("Remove this order?")) return; await fetch(`/api/orders?id=${id}`, { method: "DELETE" }); fetchOrders(); };
  const handleClearAll = async () => { if (!confirm("Clear ALL orders? This cannot be undone.")) return; await fetch("/api/orders?all=true", { method: "DELETE" }); fetchOrders(); };

  const exportCSV = () => {
    const rows: string[] = ["Name,Item,Customizations,Special Instructions,Item Price,Order Total,Time"];
    for (const order of orders) {
      for (const item of order.items) {
        const customizations = Object.entries(item.customizations).filter(([, v]) => v && (typeof v === "string" ? v : v.length > 0)).map(([k, v]) => `${k}: ${formatCustomization(v)}`).join("; ");
        rows.push([`"${order.name}"`,`"${item.menuItemName}"`,`"${customizations}"`,`"${order.specialInstructions}"`,item.itemTotal.toFixed(2),order.orderTotal.toFixed(2),`"${formatTime(order.createdAt)}"`].join(","));
      }
    }
    const blob = new Blob([rows.join("\n")], { type: "text/csv" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `westmans-group-order-${new Date().toISOString().slice(0, 10)}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  if (!authenticated) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="card" style={{ maxWidth: 360, textAlign: "center" }}>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, marginBottom: "1rem" }}>Admin Dashboard</h1>
          <p style={{ fontSize: "0.9rem", color: "#795548", marginBottom: "1rem" }}>Enter the PIN to view orders</p>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="PIN" onKeyDown={(e) => { if (e.key === "Enter" && pin === PIN_CODE) setAuthenticated(true); }} style={{ textAlign: "center", fontSize: "1.5rem", letterSpacing: "0.3em" }} />
          <button className="btn-primary" onClick={() => { if (pin === PIN_CODE) setAuthenticated(true); else alert("Incorrect PIN"); }} style={{ width: "100%", marginTop: "0.75rem" }}>Enter</button>
          <p style={{ fontSize: "0.75rem", color: "#aaa", marginTop: "0.75rem" }}>Default PIN: 1234</p>
        </div>
      </div>
    );
  }

  const itemSummary: Record<string, number> = {};
  for (const order of orders) { for (const item of order.items) { itemSummary[item.menuItemName] = (itemSummary[item.menuItemName] || 0) + item.quantity; } }

  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ background: "#3e2723", color: "#fdf6e3", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h1 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Seattle Office Bagel Day! &mdash; Admin</h1></div>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          <label style={{ fontSize: "0.8rem", display: "flex", gap: "0.35rem", alignItems: "center" }}><input type="checkbox" checked={autoRefresh} onChange={(e) => setAutoRefresh(e.target.checked)} style={{ accentColor: "#f5a623" }} />Auto-refresh</label>
          <button onClick={fetchOrders} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", color: "white", borderRadius: "6px", padding: "0.35rem 0.75rem", cursor: "pointer", fontSize: "0.85rem" }}>{loading ? "..." : "Refresh"}</button>
        </div>
      </header>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "1.5rem 1rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
          <div className="card" style={{ textAlign: "center" }}><div style={{ fontSize: "2rem", fontWeight: 700, color: "#f5a623" }}>{orders.length}</div><div style={{ fontSize: "0.85rem", color: "#795548" }}>Total Orders</div></div>
          <div className="card" style={{ textAlign: "center" }}><div style={{ fontSize: "2rem", fontWeight: 700, color: "#f5a623" }}>{orders.reduce((s, o) => s + o.items.length, 0)}</div><div style={{ fontSize: "0.85rem", color: "#795548" }}>Total Items</div></div>
          <div className="card" style={{ textAlign: "center" }}><div style={{ fontSize: "2rem", fontWeight: 700, color: "#27ae60" }}>{formatPrice(grandTotal)}</div><div style={{ fontSize: "0.85rem", color: "#795548" }}>Grand Total</div></div>
        </div>
        {Object.keys(itemSummary).length > 0 && (
          <div className="card" style={{ marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.75rem" }}>Item Summary (for placing the order)</h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {Object.entries(itemSummary).sort((a, b) => b[1] - a[1]).map(([name, count]) => (<span key={name} style={{ background: "#fff9ed", border: "1px solid #f5a623", borderRadius: "20px", padding: "0.3rem 0.75rem", fontSize: "0.9rem", fontWeight: 600 }}>{name} &times; {count}</span>))}
            </div>
          </div>
        )}
        <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={exportCSV} disabled={orders.length === 0}>Export CSV</button>
          <button className="btn-danger" onClick={handleClearAll} disabled={orders.length === 0}>Clear All Orders</button>
        </div>
        {orders.length === 0 ? (
          <div className="card" style={{ textAlign: "center", padding: "3rem" }}><p style={{ color: "#999", fontStyle: "italic" }}>No orders yet. Share the link with your team!</p></div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", background: "var(--soft-white)", borderRadius: "10px", overflow: "hidden", boxShadow: "0 2px 8px rgba(62,39,35,0.06)" }}>
              <thead>
                <tr style={{ background: "#3e2723", color: "#fdf6e3", textAlign: "left" }}>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, fontSize: "0.85rem" }}>Name</th>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, fontSize: "0.85rem" }}>Items</th>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, fontSize: "0.85rem" }}>Customizations</th>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, fontSize: "0.85rem" }}>Instructions</th>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, fontSize: "0.85rem" }}>Total</th>
                  <th style={{ padding: "0.75rem 1rem", fontWeight: 600, fontSize: "0.85rem" }}>Time</th>
                  <th style={{ padding: "0.75rem 0.5rem" }}></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, oi) => (
                  <tr key={order.id} style={{ borderBottom: "1px solid #f0e6d3", background: oi % 2 === 0 ? "var(--soft-white)" : "#fdf6e3" }}>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700, verticalAlign: "top" }}>{order.name}</td>
                    <td style={{ padding: "0.75rem 1rem", verticalAlign: "top" }}>{order.items.map((item, i) => (<div key={i} style={{ marginBottom: i < order.items.length - 1 ? "0.25rem" : 0 }}>{item.menuItemName}{item.quantity > 1 ? ` x${item.quantity}` : ""}</div>))}</td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", color: "#795548", verticalAlign: "top" }}>{order.items.map((item, i) => { const parts = Object.entries(item.customizations).filter(([, v]) => v && (typeof v === "string" ? v : v.length > 0)).map(([, v]) => formatCustomization(v)); return (<div key={i} style={{ marginBottom: i < order.items.length - 1 ? "0.25rem" : 0 }}>{parts.join(", ") || "\u2014"}</div>); })}</td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.85rem", fontStyle: order.specialInstructions ? "normal" : "italic", color: order.specialInstructions ? "#3e2723" : "#ccc", verticalAlign: "top" }}>{order.specialInstructions || "\u2014"}</td>
                    <td style={{ padding: "0.75rem 1rem", fontWeight: 700, verticalAlign: "top" }}>{formatPrice(order.orderTotal)}</td>
                    <td style={{ padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#795548", verticalAlign: "top", whiteSpace: "nowrap" }}>{formatTime(order.createdAt)}</td>
                    <td style={{ padding: "0.75rem 0.5rem", verticalAlign: "top" }}><button onClick={() => handleDeleteOrder(order.id)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: "1.1rem" }} title="Remove order">&times;</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
