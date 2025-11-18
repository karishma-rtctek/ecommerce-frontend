import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, increaseQty, decreaseQty } from "../redux/slices/cartSlice";
import type { RootState } from "../redux/store"; // ✅ type-only import fixed
import { Link } from "react-router-dom";

export default function Cart() {
  const cart = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <style>{`
        .cart-container {
          max-width: 900px;
          margin: 40px auto;
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .cart-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 18px 0;
          border-bottom: 1px solid #ececec;
          font-size: 18px;
        }

        .item-left {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
        }

        .qty-btn {
          padding: 6px 12px;
          border: 1px solid black;
          background: white;
          cursor: pointer;
          margin: 0 5px;
          border-radius: 6px;
          font-size: 16px;
        }

        .delete-btn {
          padding: 6px 10px;
          border: none;
          background: red;
          color: white;
          cursor: pointer;
          border-radius: 6px;
        }

        .checkout-btn {
          background: black;
          color: white;
          border: none;
          padding: 14px;
          width: 100%;
          border-radius: 12px;
          margin-top: 25px;
          cursor: pointer;
          font-size: 18px;
        }

        .total-text {
          text-align: right;
          margin-top: 20px;
          font-size: 24px;
          font-weight: bold;
        }
      `}</style>

      <div className="cart-container">
        <h2>Your Cart</h2>

        {cart.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          cart.map((item) => (
            <div key={item.id} className="cart-item">
              {/* LEFT SIDE */}
              <div className="item-left">
                <span>{item.image}</span>
                <span>{item.name}</span>
              </div>

              {/* QUANTITY */}
              <div>
                <button className="qty-btn" onClick={() => dispatch(decreaseQty(item.id))}>-</button>
                {item.quantity}
                <button className="qty-btn" onClick={() => dispatch(increaseQty(item.id))}>+</button>
              </div>

              {/* PRICE */}
              <strong>₹{item.price * item.quantity}</strong>

              {/* DELETE BUTTON */}
              <button 
                className="delete-btn"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                X
              </button>
            </div>
          ))
        )}

        {cart.length > 0 && (
          <>
            <h3 className="total-text">Total: ₹{total}</h3>

            <Link to="/checkout">
              <button className="checkout-btn">Proceed to Checkout</button>
            </Link>
          </>
        )}
      </div>
    </>
  );
}
