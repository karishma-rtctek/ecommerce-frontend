import { Link } from "react-router-dom";


export default function HomePage() {
  const products = [
    { id: 4, name: "Classic White T-Shirt", price: 499, description: "Soft cotton T-shirt", image: "👕" },
    { id: 5, name: "Plant", price: 1299, description: "Indoor decorative plant", image: "🪴" },
    { id: 6, name: "Sneakers", price: 2499, description: "Comfortable running sneakers", image: "👟" },
    { id: 7, name: "Leather Wallet", price: 799, description: "Stylish and durable wallet", image: "👛" },
    { id: 8, name: "Smart Watch", price: 2999, description: "Track fitness and time easily", image: "⌚" },
    { id: 9, name: "Casual Jacket", price: 1999, description: "Perfect for cool evenings", image: "🧥" }
  ];

  return (
    <>
      {/* INLINE CSS */}
      <style>{`
        .home-wrapper {
          width: 100%;
          display: flex;
          justify-content: center;
          margin-top: 20px;
          overflow-x: hidden;
        }

        .home-container {
          width: 1100px;
          background: white;
          padding: 20px;
        }

        .products-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .product-card {
          background: white;
          border: 1px solid #e5e5e5;
          border-radius: 15px;
          padding: 25px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          text-align: center;
          transition: 0.3s ease;
        }

        .product-card:hover {
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
          transform: translateY(-5px);
        }

        .product-img {
          font-size: 65px;
          margin-bottom: 15px;
        }

        .product-title {
          font-size: 18px;
          font-weight: 600;
        }

        .product-desc {
          color: gray;
          font-size: 14px;
          margin-top: 3px;
        }

        .product-price {
          font-size: 18px;
          font-weight: bold;
          margin-top: 10px;
        }

        .btn-add {
          width: 100%;
          background: black;
          color: white;
          padding: 10px;
          border-radius: 8px;
          border: none;
          margin-top: 15px;
          cursor: pointer;
          transition: 0.2s;
        }

        .btn-add:hover {
          background: #333;
        }
      `}</style>

      <div className="home-wrapper">
        <div className="home-container">

          <h1 style={{ textAlign: "center", fontSize: "32px", fontWeight: "bold", marginBottom: "40px" }}>
            Our Products
          </h1>

          <div className="products-grid">
            {products.map((p) => (
              <Link to={`/product/${p.id}`} className="product-card">

                <div className="product-img">{p.image}</div>

                <h2 className="product-title">{p.name}</h2>
                <p className="product-desc">{p.description}</p>

                <p className="product-price">₹{p.price}</p>

                <button className="btn-add">Add to Cart</button>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
