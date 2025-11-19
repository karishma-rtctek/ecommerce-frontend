import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/slices/cartSlice";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true);

      const res = await axios.get(
        `http://localhost:5000/api/products?page=${page}`
      );

      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchProducts(page);
  };

  if (loading)
    return <h2 style={{ textAlign: "center", marginTop: "50px" }}>Loading…</h2>;

  return (
    <>
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
  font-size: 55px;  
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

  .product-title {
    font-size: 16px;
    font-weight: 600;
    margin-top: 5px;
    margin-bottom: 6px;
  }

  .product-desc {
    font-size: 14px;
    color: #666;
    height: 40px;
    overflow: hidden;
  }

  .product-price {
    margin-top: 10px;
    font-weight: bold;
    font-size: 18px;
  }

  /* Add to cart button */
  .cart-btn {
    width: 100%;
    padding: 10px;
    margin-top: 12px;
    border: none;
    background: black;
    color: white;
    border-radius: 6px;
    font-size: 15px;
    cursor: pointer;
    transition: 0.3s;
  }

  .cart-btn:hover {
    background: #333;
  }

  .pagination-box {
    display: flex;
    justify-content: center;
    margin-top: 40px;
    gap: 10px;
  }

  .page-btn {
    padding: 8px 14px;
    border: 1px solid #ddd;
    background: #f8f8f8;
    border-radius: 6px;
    cursor: pointer;
    font-size: 14px;
  }

  .page-btn.active {
    background: black;
    color: white;
    border: none;
  }
`}</style>

      <div className="home-wrapper">
        <div className="home-container">
          <h1
            style={{
              textAlign: "center",
              fontSize: "32px",
              fontWeight: "bold",
              marginBottom: "40px",
            }}
          >
            Our Products
          </h1>

          <div className="products-grid">
            {products.map((p: any) => (
              <div className="product-card" key={p.id}>
                <Link
                  to={`/product/${p.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="product-img">{p.image || "🛍️"}</div>

                  <h2 className="product-title">{p.name}</h2>
                  <p className="product-desc">{p.description}</p>
                  <p className="product-price">₹{p.price}</p>
                </Link>

                {/* Add to cart button */}
                <button
                  className="cart-btn"
                  onClick={() => dispatch(addToCart(p))}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

          {/* PAGINATION UI */}
          <div className="pagination-box">
            {[...Array(pagination.totalPages)].map((_, i) => (
              <button
                key={i}
                className={`page-btn ${
                  pagination.currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
