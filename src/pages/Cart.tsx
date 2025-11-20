import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

// ⭐ Define the structure of each cart item
interface CartItem {
  cartId: number;
  productId: number; // match backend
  name: string;
  image: string;
  price: number;
  quantity: number;
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const navigate = useNavigate();

  const loadCart = async () => {
    // Fetch cart data from the backend API
    const res = await axiosClient.get("/cart");

    // Process the response data:
    // 1. Ensure numeric values for price and quantity (sometimes API may return strings)
    // 2. Sort the cart items by cartId to maintain a consistent order in the UI
    const sortedCart = res.data
      .map((item: any) => ({
        ...item,
        price: Number(item.price), // Convert price to number
        quantity: Number(item.quantity), // Convert quantity to number
      }))
      .sort((a: any, b: any) => a.cartId - b.cartId); // Sort by cartId ascending

    // Update the state with the sorted cart items
    // This ensures items don't change positions unexpectedly in the UI
    setCart(sortedCart);
  };

  useEffect(() => {
    loadCart();
  }, []);

  const updateQty = async (cartId: number, qty: number) => {
    qty = Math.max(1, qty);

    await axiosClient.put(`/cart/update/${cartId}`, {
      quantity: qty,
    });

    loadCart();
  };

  const removeItem = async (cartId: number) => {
    await axiosClient.delete(`/cart/remove/${cartId}`);
    loadCart();
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <style>{`
        .cart-container {
          width: 90%;
          max-width: 900px;
          margin: 40px auto;
          background: #ffffff;
          padding: 25px;
          border-radius: 20px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.08);
          font-family: "Inter", sans-serif;
        }

        .cart-title {
          font-size: 30px;
          font-weight: 700;
          margin-bottom: 25px;
          color: #111;
          text-align: center;
        }

        .cart-item {
          display: grid;
          grid-template-columns: 60px 1fr 160px 40px;
          align-items: center;
          background: #fafafa;
          padding: 16px;
          border-radius: 14px;
          margin-bottom: 15px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
        }

        .cart-img {
          font-size: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .item-name {
          font-size: 15px;
          font-weight: 600;
          color: #333;
          max-width: 200px;
          line-height: 1.3;
          word-wrap: break-word;
        }

        .qty-box {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #fff;
          padding: 8px 12px;
          border-radius: 10px;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
        }

        .qty-btn {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          background: #111;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 18px;
          font-weight: bold;
          transition: 0.2s;
        }

        .qty-btn:hover {
          background: #333;
        }

        .item-total {
          font-size: 15px;
          font-weight: 700;
          margin-left: 10px;
          color: #111;
        }

        .remove-btn {
          cursor: pointer;
          font-size: 20px;
          font-weight: bold;
          color: #ff4a4a;
          transition: 0.2s;
        }

        .remove-btn:hover {
          color: #d10000;
        }

        .total-box {
          text-align: right;
          margin-top: 25px;
          font-size: 22px;
          font-weight: 700;
          color: #111;
        }

        .checkout-btn {
          width: 100%;
          padding: 14px;
          background: #111;
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          cursor: pointer;
          margin-top: 20px;
          transition: 0.25s;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .checkout-btn:hover {
          background: #333;
        }
      `}</style>

      <div className="cart-container">
        <h2 className="cart-title">🛒 Your Cart</h2>

        {cart.map((item) => (
          <div className="cart-item" key={item.cartId}>
            <div className="cart-img">{item.image}</div>

            <div className="item-name">{item.name}</div>

            <div className="qty-box">
              <button
                className="qty-btn"
                onClick={() => updateQty(item.cartId, item.quantity - 1)}
              >
                -
              </button>

              <span>{item.quantity}</span>

              <button
                className="qty-btn"
                onClick={() => updateQty(item.cartId, item.quantity + 1)}
              >
                +
              </button>

              <span className="item-total">₹{item.price * item.quantity}</span>
            </div>

            <div className="remove-btn" onClick={() => removeItem(item.cartId)}>
              ✕
            </div>
          </div>
        ))}

        <div className="total-box">Total: ₹{total}</div>

        {cart.length > 0 && (
          <button
            className="checkout-btn"
            onClick={() => navigate("/checkout")}
          >
            Proceed to Checkout
          </button>
        )}
      </div>
    </>
  );
}
