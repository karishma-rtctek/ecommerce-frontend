import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

interface CartItem {
  cartId: number;
  productId: number;
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCart = async () => {
    try {
      const res = await axiosClient.get("/cart");
      setCart(
        res.data.map((item: any) => ({
          ...item,
          price: Number(item.price),
          quantity: Number(item.quantity),
        }))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (cart.length === 0) return <p>Your cart is empty!</p>;

  // Billing calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryCharges = subtotal > 1000 ? 0 : 50; // free delivery above 1000
  const gst = 0.18 * subtotal; // 18% GST
  const total = subtotal + deliveryCharges + gst;

  const placeOrder = async () => {
    if (!address) return alert("Please enter a shipping address");

    try {
      await axiosClient.post("/orders/create", {
        items: cart.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        address,
        subtotal,
        deliveryCharges,
        gst,
        total,
      });

      alert("Order placed successfully!");
      navigate("/"); // redirect to homepage or order confirmation
    } catch (err) {
      console.error(err);
      alert("Failed to place order, try again.");
    }
  };

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "40px auto",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Checkout</h1>

      <div style={{ marginBottom: "30px" }}>
        <h2>Shipping Address</h2>
        <textarea
          rows={4}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your shipping address"
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "8px",
            fontSize: "16px",
          }}
        />
      </div>

      <div style={{ marginBottom: "30px" }}>
        <h2>Order Summary</h2>
        <div>
          {cart.map((item) => (
            <div
              key={item.cartId}
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <div>
                {item.name} × {item.quantity}
              </div>
              <div>₹{item.price * item.quantity}</div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "15px",
            borderTop: "1px solid #ddd",
            paddingTop: "10px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Subtotal</div>
            <div>₹{subtotal.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>Delivery Charges</div>
            <div>₹{deliveryCharges.toFixed(2)}</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>GST (18%)</div>
            <div>₹{gst.toFixed(2)}</div>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontWeight: "700",
              fontSize: "18px",
              marginTop: "10px",
            }}
          >
            <div>Total</div>
            <div>₹{total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      <button
        onClick={placeOrder}
        style={{
          width: "100%",
          padding: "14px",
          background: "black",
          color: "white",
          border: "none",
          borderRadius: "12px",
          fontSize: "18px",
          cursor: "pointer",
        }}
      >
        Place Order
      </button>
    </div>
  );
}
