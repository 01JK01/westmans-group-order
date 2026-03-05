"use client";

import { useState, useCallback } from "react";
import { MENU, CATEGORIES, type MenuItem, type CustomizationGroup } from "@/lib/menu";

interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  customizations: Record<string, string | string[]>;
  customizationTotal: number;
  itemTotal: number;
}

function formatPrice(cents: number): string {
  return `$${cents.toFixed(2)}`;
}

function CustomizationSelector({ group, value, onChange }: { group: CustomizationGroup; value: string | string[]; onChange: (val: string | string[]) => void; }) {
  if (group.type === "single") {
    return (
      <div style={{ marginBottom: "0.75rem" }}>
        <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem", color: "#5d4037" }}>
          {group.name}{group.required && <span style={{ color: "#c0392b" }}> *</span>}
        </label>
        <select value={(value as string) || ""} onChange={(e) => onChange(e.target.value)} required={group.required}>
          <option value="">Select...</option>
          {group.options.map((opt) => (<option key={opt.id} value={opt.id}>{opt.name}{opt.price > 0 ? ` (+${formatPrice(opt.price)})` : ""}</option>))}
        </select>
      </div>
    );
  }
  const selected = (value as string[]) || [];
  return (
    <div style={{ marginBottom: "0.75rem" }}>
      <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.35rem", color: "#5d4037" }}>{group.name}</label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {group.options.map((opt) => (
          <label key={opt.id} style={{ display: "flex", alignItems: "center", gap: "0.35rem", fontSize: "0.9rem", cursor: "pointer", background: selected.includes(opt.id) ? "#fff9ed" : "white", border: selected.includes(opt.id) ? "1.5px solid #f5a623" : "1.5px solid #f0e6d3", borderRadius: "6px", padding: "0.4rem 0.6rem" }}>
            <input type="checkbox" checked={selected.includes(opt.id)} onChange={(e) => { if (e.target.checked) { onChange([...selected, opt.id]); } else { onChange(selected.filter((s) => s !== opt.id)); } }} style={{ accentColor: "#f5a623" }} />
            {opt.name}{opt.price > 0 ? ` (+${formatPrice(opt.price)})` : ""}
          </label>
        ))}
      </div>
    </div>
  );
}

function MenuItemCard({ item, onAdd }: { item: MenuItem; onAdd: (item: MenuItem, customizations: Record<string, string | string[]>) => void; }) {
  const [expanded, setExpanded] = useState(false);
  const [customizations, setCustomizations] = useState<Record<string, string | string[]>>({});
  const hasCustomizations = item.customizations && item.customizations.length > 0;
  const calcCustomizationTotal = useCallback(() => {
    if (!item.customizations) return 0;
    let total = 0;
    for (const group of item.customizations) {
      const val = customizations[group.name];
      if (!val) continue;
      if (group.type === "single") { const opt = group.options.find((o) => o.id === val); if (opt) total += opt.price; }
      else { for (const id of val as string[]) { const opt = group.options.find((o) => o.id === id); if (opt) total += opt.price; } }
    }
    return total;
  }, [item.customizations, customizations]);
  const handleAdd = () => {
    if (hasCustomizations) { const missingRequired = item.customizations?.some((g) => g.required && !customizations[g.name]); if (missingRequired) { setExpanded(true); return; } }
    onAdd(item, customizations); setCustomizations({}); setExpanded(false);
  };
  const total = item.price + calcCustomizationTotal();
  return (
    <div className="menu-item animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "0.15rem" }}>{item.name}</div>
          {item.description && <div style={{ fontSize: "0.85rem", color: "#795548", marginBottom: "0.25rem" }}>{item.description}</div>}
        </div>
        <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#3e2723", whiteSpace: "nowrap", marginLeft: "1rem" }}>{formatPrice(item.price)}</div>
      </div>
      {hasCustomizations && !expanded && <button onClick={() => setExpanded(true)} style={{ marginTop: "0.5rem", background: "none", border: "1.5px solid #f5a623", borderRadius: "6px", padding: "0.35rem 0.75rem", color: "#d4891a", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>Customize & Add</button>}
      {!hasCustomizations && <button onClick={handleAdd} className="btn-primary" style={{ marginTop: "0.5rem", padding: "0.4rem 1rem", fontSize: "0.85rem" }}>Add to Order</button>}
      {expanded && (
        <div style={{ marginTop: "0.75rem", paddingTop: "0.75rem", borderTop: "1px solid #f0e6d3" }}>
          {item.customizations!.map((group) => <CustomizationSelector key={group.name} group={group} value={customizations[group.name] || (group.type === "multiple" ? [] : "")} onChange={(val) => setCustomizations((prev) => ({ ...prev, [group.name]: val }))} />)}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.5rem" }}>
            <span style={{ fontWeight: 600 }}>Item total: {formatPrice(total)}</span>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => { setExpanded(false); setCustomizations({}); }} style={{ background: "none", border: "1px solid #ccc", borderRadius: "6px", padding: "0.4rem 0.75rem", cursor: "pointer", fontSize: "0.85rem" }}>Cancel</button>
              <button onClick={handleAdd} className="btn-primary" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>Add to Order</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function OrderPage() {
  const [name, setName] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Sandwiches");

  const addToCart = (item: MenuItem, customizations: Record<string, string | string[]>) => {
    let customizationTotal = 0;
    if (item.customizations) {
      for (const group of item.customizations) {
        const val = customizations[group.name];
        if (!val) continue;
        if (group.type === "single") { const opt = group.options.find((o) => o.id === val); if (opt) customizationTotal += opt.price; }
        else { for (const id of val as string[]) { const opt = group.options.find((o) => o.id === id); if (opt) customizationTotal += opt.price; } }
      }
    }
    const cartItem: CartItem = { menuItem: item, quantity: 1, customizations, customizationTotal, itemTotal: item.price + customizationTotal };
    setCart((prev) => [...prev, cartItem]);
  };
  const removeFromCart = (index: number) => { setCart((prev) => prev.filter((_, i) => i !== index)); };
  const cartTotal = cart.reduce((sum, item) => sum + item.itemTotal * item.quantity, 0);
  const formatCustomizations = (item: MenuItem, customizations: Record<string, string | string[]>) => {
    const parts: string[] = [];
    if (!item.customizations) return "";
    for (const group of item.customizations) {
      const val = customizations[group.name];
      if (!val || (Array.isArray(val) && val.length === 0)) continue;
      if (group.type === "single") { const opt = group.options.find((o) => o.id === val); if (opt) parts.push(opt.name); }
      else { for (const id of val as string[]) { const opt = group.options.find((o) => o.id === id); if (opt) parts.push(opt.name); } }
    }
    return parts.join(", ");
  };
  const handleSubmit = async () => {
    if (!name.trim()) { setError("Please enter your name"); return; }
    if (cart.length === 0) { setError("Please add at least one item"); return; }
    setSubmitting(true); setError("");
    try {
      const res = await fetch("/api/orders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), items: cart.map((c) => ({ menuItemId: c.menuItem.id, menuItemName: c.menuItem.name, basePrice: c.menuItem.price, quantity: c.quantity, customizations: c.customizations, customizationTotal: c.customizationTotal, itemTotal: c.itemTotal })), specialInstructions, orderTotal: cartTotal }) });
      if (!res.ok) { const data = await res.json(); throw new Error(data.error || "Failed to submit order"); }
      setSubmitted(true);
    } catch (err: unknown) { setError(err instanceof Error ? err.message : "Something went wrong"); } finally { setSubmitting(false); }
  };
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div className="success-banner animate-in" style={{ maxWidth: 480 }}>
          <div style={{ fontSize: "3rem", marginBottom: "0.5rem" }}>&#127839;</div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>Order Submitted!</h2>
          <p style={{ marginBottom: "0.25rem" }}>Thanks, <strong>{name}</strong>! Your order has been placed.</p>
          <p style={{ fontSize: "0.9rem", color: "#558b2f" }}><strong>{cart.length} item{cart.length !== 1 ? "s" : ""}</strong> &mdash; <strong>{formatPrice(cartTotal)}</strong></p>
          <p style={{ fontSize: "0.85rem", marginTop: "1rem", color: "#666" }}>Joe will place the group order. Sit tight!</p>
          <button onClick={() => { setSubmitted(false); setName(""); setCart([]); setSpecialInstructions(""); }} style={{ marginTop: "1rem", background: "none", border: "1.5px solid #27ae60", borderRadius: "6px", padding: "0.5rem 1rem", color: "#27ae60", fontWeight: 600, cursor: "pointer" }}>Place Another Order</button>
        </div>
      </div>
    );
  }
  return (
    <div style={{ minHeight: "100vh" }}>
      <header style={{ background: "#3e2723", color: "#fdf6e3", padding: "1.5rem 2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 700, letterSpacing: "0.02em", marginBottom: "0.25rem" }}>Westman&apos;s Bagel &amp; Coffee</h1>
        <p style={{ fontSize: "0.95rem", opacity: 0.85 }}>Office Group Order &mdash; Thursday, March 12</p>
      </header>
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "1.5rem 1rem", display: "grid", gridTemplateColumns: "1fr 340px", gap: "1.5rem", alignItems: "start" }}>
        <div>
          <div className="card" style={{ marginBottom: "1rem" }}>
            <label style={{ display: "block", fontWeight: 700, marginBottom: "0.35rem" }}>Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name..." style={{ maxWidth: 320 }} />
          </div>
          <div style={{ display: "flex", gap: "0.25rem", marginBottom: "1rem", borderBottom: "2px solid #f0e6d3", paddingBottom: "0" }}>
            {CATEGORIES.map((cat) => (<button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: "0.5rem 1rem", fontWeight: 600, fontSize: "0.95rem", background: activeCategory === cat ? "#f5a623" : "transparent", color: activeCategory === cat ? "#3e2723" : "#795548", border: "none", borderRadius: "8px 8px 0 0", cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s" }}>{cat}</button>))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {MENU.filter((item) => item.category === activeCategory).map((item) => (<MenuItemCard key={item.id} item={item} onAdd={addToCart} />))}
          </div>
        </div>
        <div className="card" style={{ position: "sticky", top: "1rem" }}>
          <h2 style={{ fontSize: "1.15rem", fontWeight: 700, marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.5rem" }}>Your Order{cart.length > 0 && <span className="badge">{cart.length}</span>}</h2>
          {cart.length === 0 ? (<p style={{ color: "#999", fontSize: "0.9rem", fontStyle: "italic" }}>No items yet. Browse the menu and add items!</p>) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {cart.map((cartItem, index) => (
                <div key={index} className="animate-in" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "0.5rem", background: "#fff9ed", borderRadius: "6px", fontSize: "0.9rem" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600 }}>{cartItem.menuItem.name}</div>
                    {formatCustomizations(cartItem.menuItem, cartItem.customizations) && <div style={{ fontSize: "0.8rem", color: "#795548", marginTop: "0.1rem" }}>{formatCustomizations(cartItem.menuItem, cartItem.customizations)}</div>}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{formatPrice(cartItem.itemTotal)}</span>
                    <button onClick={() => removeFromCart(index)} style={{ background: "none", border: "none", color: "#c0392b", cursor: "pointer", fontSize: "1.1rem", lineHeight: 1, padding: "0.15rem" }} title="Remove">&times;</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {cart.length > 0 && (<>
            <div style={{ borderTop: "2px solid #f0e6d3", marginTop: "0.75rem", paddingTop: "0.75rem", display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem" }}><span>Total</span><span>{formatPrice(cartTotal)}</span></div>
            <div style={{ marginTop: "0.75rem" }}>
              <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.25rem" }}>Special Instructions</label>
              <textarea value={specialInstructions} onChange={(e) => setSpecialInstructions(e.target.value)} placeholder="Allergies, preferences, etc." rows={2} style={{ fontSize: "0.9rem" }} />
            </div>
            {error && <p style={{ color: "#c0392b", fontSize: "0.85rem", marginTop: "0.5rem", fontWeight: 600 }}>{error}</p>}
            <button className="btn-primary" onClick={handleSubmit} disabled={submitting} style={{ width: "100%", marginTop: "0.75rem" }}>{submitting ? "Submitting..." : "Submit Order"}</button>
          </>)}
        </div>
      </div>
      <style>{`@media (max-width: 768px) { div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; } div[style*="position: sticky"] { position: fixed !important; bottom: 0; left: 0; right: 0; top: auto !important; border-radius: 16px 16px 0 0 !important; max-height: 45vh; overflow-y: auto; box-shadow: 0 -4px 20px rgba(0,0,0,0.15); z-index: 50; } }`}</style>
    </div>
  );
}
