import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  name: string;
  image: string;
}

interface Order {
  id: number;
  user_id: number;
  total: number;
  created_at: string;
  items: OrderItem[];
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await axiosClient.get("/orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.log("❌ Error fetching orders", err);
    }
    setLoading(false);
  }

  return (
    <>
      <style>{`
        .orders-container {
          max-width: 900px;
          margin: 40px auto;
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .order-box {
          border: 1px solid #eee;
          padding: 20px;
          margin-bottom: 20px;
          border-radius: 12px;
          background: #fafafa;
        }

        .order-title {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .order-date {
          color: gray;
          margin-bottom: 15px;
          font-size: 15px;
        }

        .order-item {
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #ddd;
          padding: 10px 0;
          font-size: 17px;
        }

        .order-total {
          margin-top: 15px;
          text-align: right;
          font-size: 20px;
          font-weight: bold;
        }
      `}</style>

      <div className="orders-container">
        <h2>Your Orders</h2>

        {loading && <p>Loading orders...</p>}

        {!loading && orders.length === 0 && <p>No orders yet.</p>}

        {!loading &&
          orders.map((order) => (
            <div key={order.id} className="order-box">
              <div className="order-title">Order #{order.id}</div>

              <div className="order-date">
                Placed on: {new Date(order.created_at).toLocaleString()}
              </div>

              {order.items.map((item) => (
                <div key={item.id} className="order-item">
                  <span>
                    {item.image} {item.name} × {item.quantity}
                  </span>
                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}

              <div className="order-total">Total: ₹{order.total}</div>
            </div>
          ))}
      </div>
    </>
  );
}
