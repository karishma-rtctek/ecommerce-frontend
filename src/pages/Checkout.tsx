import React, { useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axiosClient from "../api/axiosClient"; // uses baseURL http://localhost:4000/api
import type { RootState } from "../redux/store";
import { clearCart } from "../redux/slices/cartSlice";
import { useNavigate } from "react-router-dom";

export default function Checkout() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const user = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const total = useMemo(() => cart.reduce((s, it) => s + it.price * it.quantity, 0), [cart]);

  // Build payload compatible with either backend shape:
  // { items: [{ product_id, quantity }], total }  OR
  // { cartItems: [{ id, quantity }], totalAmount }
  const buildPayload = () => {
    const itemsForBackend = cart.map((it) => ({
      product_id: it.id,
      quantity: it.quantity,
      price: it.price,
    }));

    const cartItemsAlternative = cart.map((it) => ({
      id: it.id,
      quantity: it.quantity,
      price: it.price,
    }));

    return {
      // include both shapes — backend will read whichever it expects
      items: itemsForBackend,
      cartItems: cartItemsAlternative,
      // include both totals too (safe)
      total,
      totalAmount: total,
    };
  };

  const placeOrder = async () => {
    if (!user) {
      setError("You must be logged in to place an order.");
      return;
    }
    if (!cart.length) {
      setError("Your cart is empty.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const payload = buildPayload();

      // Use axiosClient (recommended). If not configured, it falls back to window fetch
      const res = await axiosClient.post("/orders", payload);
      // If you don't have axiosClient, you can use:
      // const res = await axios.post("http://localhost:4000/api/orders", payload, { headers: { Authorization: `Bearer ${token}` }});

      // success
      setLoading(false);
      dispatch(clearCart());
      // optionally read order id from response (common: res.data.orderId or res.data.order.id)
      const orderId = res.data?.orderId ?? res.data?.order?.id ?? null;
      navigate("/orders"); // go to order history / orders page
      // optionally pass order id via state:
      // navigate(`/orders/${orderId}`, { state: { orderId } });
    } catch (err: any) {
      console.error("Place order error:", err);
      setLoading(false);
      setError(err?.response?.data?.message ?? "Could not place order.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.box}>
        <h2 style={{ marginBottom: 10 }}>Checkout</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <div style={styles.items}>
              {cart.map((it) => (
                <div key={it.id} style={styles.item}>
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div style={styles.emoji}>{it.image ?? "📦"}</div>
                    <div>
                      <div style={{ fontWeight: 600 }}>{it.name}</div>
                      <div style={{ color: "#666", fontSize: 14 }}>
                        {it.quantity} × ₹{it.price}
                      </div>
                    </div>
                  </div>

                  <div style={{ fontWeight: 700 }}>₹{it.price * it.quantity}</div>
                </div>
              ))}
            </div>

            <div style={styles.summary}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <div>Subtotal</div>
                <div>₹{total.toFixed(2)}</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
                <div>Shipping</div>
                <div>₹0.00</div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700 }}>
                <div>Total</div>
                <div>₹{total.toFixed(2)}</div>
              </div>

              {error && <div style={{ color: "red", marginTop: 12 }}>{error}</div>}

              <button
                onClick={placeOrder}
                disabled={loading}
                style={{ ...styles.placeBtn, opacity: loading ? 0.7 : 1 }}
              >
                {loading ? "Placing order..." : "Place Order"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const styles: any = {
  page: {
    display: "flex",
    justifyContent: "center",
    padding: "40px 20px",
    overflowX: "hidden",
  },
  box: {
    width: 900,
    maxWidth: "100%",
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
    padding: 24,
    boxSizing: "border-box",
  },
  items: {
    borderBottom: "1px solid #eee",
    paddingBottom: 16,
    marginBottom: 16,
  },
  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "12px 0",
    alignItems: "center",
  },
  emoji: {
    fontSize: 34,
    width: 54,
    height: 54,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f7f7",
    borderRadius: 8,
  },
  summary: {
    marginTop: 12,
  },
  placeBtn: {
    width: "100%",
    background: "#111827",
    color: "white",
    border: "none",
    padding: "12px 16px",
    borderRadius: 10,
    cursor: "pointer",
    marginTop: 18,
    fontSize: 16,
    fontWeight: 700,
  },
};
