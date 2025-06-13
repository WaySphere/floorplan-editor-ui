import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage({setOrganizationId}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const res = await fetch("http://localhost:5767/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password.trim()
      })
    });
    if (res.ok) {
      const data = await res.json();
      setOrganizationId(data.organizationId);
      navigate("/dashboard"); }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e0e7ff 0%, #f8fafc 100%)"
    }}>
      <form
        onSubmit={handleLogin}
        style={{
          background: "#fff",
          padding: "2.5rem 2rem",
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          minWidth: 340,
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div style={{
          fontWeight: 700,
          fontSize: "2rem",
          marginBottom: 8,
          color: "#1e293b",
          letterSpacing: 1
        }}>
          Admin Login
        </div>
        <div style={{
          fontSize: "1rem",
          color: "#64748b",
          marginBottom: 24
        }}>
          Floorplan Editor Access
        </div>
        <input
          type="email"
          placeholder="Username or Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "18px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            fontSize: "1rem"
          }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "18px",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            fontSize: "1rem"
          }}
        />
        {error && (
          <div style={{ color: "#dc2626", marginBottom: 12 }}>{error}</div>
        )}
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "12px",
            background: "linear-gradient(90deg, #6366f1 0%, #3b82f6 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            fontWeight: 600,
            fontSize: "1.1rem",
            cursor: "pointer",
            marginBottom: 8,
            boxShadow: "0 2px 8px rgba(59,130,246,0.08)"
          }}
        >
          Login
        </button>
        <div style={{ fontSize: "0.95rem", color: "#64748b", marginTop: 10 }}>
          Only authorized admins can access this tool.
        </div>
      </form>
    </div>
  );
}