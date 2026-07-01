import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, role, loading } = useAuth();

  // 1. Mientras Firebase verifica quién es el usuario, mostramos una carga
  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <h2>Cargando Sistema Skinity...</h2> 
        {/* Luego podemos cambiar esto por un spinner/logo animado */}
      </div>
    );
  }

  // 2. Si un usuario que NO ha iniciado sesión intenta entrar a una ruta privada, lo mandamos al Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. Verificamos si el rol del usuario está dentro de los roles permitidos para esta página
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Si la cajera intenta entrar al admin, o el admin al lead, los devolvemos a su lugar correcto
    if (role === "admin") return <Navigate to="/admin" replace />;
    if (role === "cashier") return <Navigate to="/cashier" replace />;
    return <Navigate to="/" replace />; // Redirección por defecto para el cliente (lead)
  }

  // 4. Si todo está perfecto (está logueado y tiene el rol correcto), lo dejamos pasar
  return children;
}