import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, role } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await login(email, password);
      alert("¡Inicio de sesión exitoso!");
    } catch (err) {
      setError("Credenciales incorrectas. Por favor, verifica tu correo y contraseña.");
      console.error(err.message);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>Skinity Shop - Iniciar Sesión</h2>
      
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Correo Electrónico:</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label style={{ display: "block", marginBottom: "5px" }}>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>

        <button type="submit" style={{ width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>
          Ingresar al Sistema
        </button>
      </form>

      {role && (
        <div style={{ marginTop: "20px", padding: "10px", backgroundColor: "#e2e3e5", borderRadius: "4px" }}>
          <p><strong>Rol detectado en el sistema:</strong> {role.toUpperCase()}</p>
        </div>
      )}
    </div>
  );
}