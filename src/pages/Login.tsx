import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/slices/authSlice";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const res = await axiosClient.post("/auth/login", {
        email,
        password,
      });

      dispatch(loginSuccess(res.data));
      navigate("/");
    } catch (err: any) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Invalid email or password");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back 👋</h2>
        <p style={styles.subtitle}>Login to your account</p>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleLogin} style={styles.form}>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <p style={styles.signupText}>
          Don’t have an account?{" "}
          <Link to="/signup" style={styles.signupLink}>
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
}

// Simple inline styles
const styles: any = {
  page: {
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#f3f4f6",
  },
  card: {
    width: "350px",
    padding: "30px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "5px",
  },
  subtitle: {
    fontSize: "14px",
    color: "#555",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    outline: "none",
    fontSize: "14px",
  },
  button: {
    background: "#4f46e5",
    color: "white",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    fontSize: "15px",
    fontWeight: 600,
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
  signupText: {
    marginTop: "15px",
    fontSize: "14px",
    color: "#444",
  },
  signupLink: {
    color: "#4f46e5",
    textDecoration: "none",
    fontWeight: "bold",
  },
};
