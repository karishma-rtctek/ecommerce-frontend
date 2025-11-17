import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 20, background: "#eee" }}>
      <Link to="/" style={{ marginRight: 20 }}>Home</Link>
      <Link to="/login">Login</Link>
    </nav>
  );
}
