import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

export default function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const products = [
    { id: 4, name: "Classic White T-Shirt", price: 499, description: "Soft cotton T-shirt", image: "👕" },
    { id: 5, name: "Plant", price: 1299, description: "Indoor decorative plant", image: "🪴" },
    { id: 6, name: "Sneakers", price: 2499, description: "Comfortable running sneakers", image: "👟" },
    { id: 7, name: "Leather Wallet", price: 799, description: "Stylish and durable wallet", image: "👛" },
    { id: 8, name: "Smart Watch", price: 2999, description: "Track fitness and time easily", image: "⌚" },
    { id: 9, name: "Casual Jacket", price: 1999, description: "Perfect for cool evenings", image: "🧥" }
  ];

  const product = products.find((p) => String(p.id) === id);

  if (!product)
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Product Not Found</h2>;

  return (
    <>
      <style>{`
        .details-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 40px;
        }

        .details-box {
          width: 900px;
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          display: flex;
          gap: 40px;
        }

        .big-img {
          font-size: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40%;
          background: #f7f7f7;
          border-radius: 15px;
        }

        .details-content {
          width: 60%;
        }

        .product-title {
          font-size: 30px;
          font-weight: 700;
        }

        .product-desc {
          margin-top: 10px;
          font-size: 16px;
          color: #555;
        }

        .product-price {
          font-size: 26px;
          margin-top: 20px;
          font-weight: bold;
        }

        .btn-add {
          background: black;
          color: white;
          padding: 12px 20px;
          border-radius: 10px;
          border: none;
          cursor: pointer;
          margin-top: 30px;
          width: 100%;
          font-size: 16px;
          transition: 0.3s;
        }

        .btn-add:hover {
          background: #333;
        }
      `}</style>

      <div className="details-wrapper">
        <div className="details-box">
          <div className="big-img">{product.image}</div>

          <div className="details-content">
            <h1 className="product-title">{product.name}</h1>
            <p className="product-desc">{product.description}</p>

            <p className="product-price">₹{product.price}</p>

            <button
              className="btn-add"
              onClick={() =>
                dispatch(
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    quantity: 1
                  })
                )
              }
            >
              Add to Cart
            </button>

          </div>
        </div>
      </div>
    </>
  );
}
