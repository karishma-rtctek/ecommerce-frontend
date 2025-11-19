// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";

// export default function Signup() {
//   const navigate = useNavigate();

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");

//   const handleSignup = async (e: any) => {
//     e.preventDefault();
//     setError("");
//     setSuccess("");

//     try {
//       setSuccess("Account created successfully!");
//       setTimeout(() => navigate("/login"), 1200);
//     } catch (err: any) {
//       setError("Signup failed — try another email.");
//     }
//   };

//   return (
//     <div style={styles.page}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>Create Account ✨</h2>
//         <p style={styles.subtitle}>Join our community</p>

//         {error && <p style={styles.error}>{error}</p>}
//         {success && <p style={styles.success}>{success}</p>}

//         <form onSubmit={handleSignup} style={styles.form}>
//           <input
//             type="text"
//             placeholder="Enter full name"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             style={styles.input}
//             required
//           />

//           <input
//             type="email"
//             placeholder="Enter email address"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={styles.input}
//             required
//           />

//           <input
//             type="password"
//             placeholder="Create password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             style={styles.input}
//             required
//           />

//           <button type="submit" style={styles.button}>
//             Sign Up
//           </button>
//         </form>

//         <p style={styles.signupText}>
//           Already have an account?{" "}
//           <Link to="/login" style={styles.signupLink}>
//             Login
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

// const styles: any = {
//   page: {
//     height: "100vh",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "#f3f4f6",
//   },
//   card: {
//     width: "360px",
//     padding: "30px",
//     background: "#fff",
//     borderRadius: "12px",
//     boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
//     textAlign: "center",
//   },
//   title: {
//     marginBottom: "5px",
//   },
//   subtitle: {
//     fontSize: "14px",
//     color: "#555",
//     marginBottom: "20px",
//   },
//   form: {
//     display: "flex",
//     flexDirection: "column",
//     gap: "12px",
//   },
//   input: {
//     padding: "12px",
//     borderRadius: "8px",
//     border: "1px solid #ddd",
//     outline: "none",
//     fontSize: "14px",
//   },
//   button: {
//     background: "#4f46e5",
//     color: "white",
//     padding: "12px",
//     borderRadius: "8px",
//     border: "none",
//     cursor: "pointer",
//     fontSize: "15px",
//     fontWeight: 600,
//   },
//   error: {
//     color: "red",
//     marginBottom: "10px",
//     fontSize: "14px",
//   },
//   success: {
//     color: "green",
//     marginBottom: "10px",
//     fontSize: "14px",
//   },
//   signupText: {
//     marginTop: "15px",
//     fontSize: "14px",
//     color: "#444",
//   },
//   signupLink: {
//     color: "#4f46e5",
//     textDecoration: "none",
//     fontWeight: "bold",
//   },
// };


import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient"; // make sure you have axiosClient set up

export default function Signup() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async (e: any) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      console.log("Signup payload:", { name, email, password });

      const res = await axiosClient.post("/auth/signup", {
        name,
        email,
        password,
      });

      console.log("Signup response:", res.data);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      console.error("Signup error:", err.response || err);
      setError(err?.response?.data?.message || "Signup failed — try another email.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account ✨</h2>
        <p style={styles.subtitle}>Join our community</p>

        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSignup} style={styles.form}>
          <input
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="email"
            placeholder="Enter email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <input
            type="password"
            placeholder="Create password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>

        <p style={styles.signupText}>
          Already have an account?{" "}
          <Link to="/login" style={styles.signupLink}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles: any = {
  page: { height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f3f4f6" },
  card: { width: "360px", padding: "30px", background: "#fff", borderRadius: "12px", boxShadow: "0 8px 20px rgba(0,0,0,0.1)", textAlign: "center" },
  title: { marginBottom: "5px" },
  subtitle: { fontSize: "14px", color: "#555", marginBottom: "20px" },
  form: { display: "flex", flexDirection: "column", gap: "12px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #ddd", outline: "none", fontSize: "14px" },
  button: { background: "#4f46e5", color: "white", padding: "12px", borderRadius: "8px", border: "none", cursor: "pointer", fontSize: "15px", fontWeight: 600 },
  error: { color: "red", marginBottom: "10px", fontSize: "14px" },
  success: { color: "green", marginBottom: "10px", fontSize: "14px" },
  signupText: { marginTop: "15px", fontSize: "14px", color: "#444" },
  signupLink: { color: "#4f46e5", textDecoration: "none", fontWeight: "bold" },
};

