import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import axiosClient from "../api/axiosClient";
import { setCart } from "../redux/slices/cartSlice";
import { useEffect } from "react";

export default function Navbar() {
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);
  const cartCount = useSelector((state: any) => state.cart.items.length);

  useEffect(() => {
    const loadCart = async () => {
      try {
        const res = await axiosClient.get("/cart"); // fetch from backend
        dispatch(setCart(res.data)); // update Redux
      } catch (err) {
        console.error("Failed to fetch cart", err);
      }
    };

    loadCart();
  }, [dispatch]);

  return (
    <nav style={styles.nav}>
      <div style={styles.leftSection}>
        <Link to="/" style={styles.logoText}>
          ShopNow
        </Link>
      </div>

      <div style={styles.rightSection}>
        <Link to="/" style={styles.link}>
          Home
        </Link>

        <Link to="/cart" style={styles.link}>
          Cart ({cartCount})
        </Link>

        {/* Admin button visible for all users */}
        <Link to="/admin/products" style={styles.adminBtn}>
          Admin
        </Link>

        {user ? (
          <>
            <span style={styles.userName}>Hi, {user.name}</span>
            <button style={styles.logoutBtn} onClick={() => dispatch(logout())}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/signup" style={styles.signupBtn}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

const styles: any = {
  nav: {
    width: "100%",
    maxWidth: "100vw",
    padding: "15px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#4f46e5",
    color: "white",
    boxSizing: "border-box",
    overflow: "hidden",
  },
  leftSection: {
    display: "flex",
    alignItems: "center",
    maxWidth: "100%",
  },
  rightSection: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "nowrap",
    maxWidth: "100%",
  },
  logoText: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "15px",
    whiteSpace: "nowrap",
  },
  signupBtn: {
    padding: "6px 12px",
    background: "white",
    color: "#4f46e5",
    borderRadius: "6px",
    textDecoration: "none",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  logoutBtn: {
    padding: "6px 12px",
    background: "white",
    color: "#4f46e5",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: 600,
    whiteSpace: "nowrap",
  },
  userName: {
    fontSize: "15px",
    color: "white",
    whiteSpace: "nowrap",
  },
  adminBtn: {
    padding: "6px 12px",
    background: "#facc15", // yellow color
    color: "#111",
    borderRadius: "6px",
    fontWeight: 600,
    textDecoration: "none",
    whiteSpace: "nowrap",
  },
};
