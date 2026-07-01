import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./features/lead/components/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext"; // Solo lo importamos para los componentes de prueba

// --- COMPONENTES DE PRUEBA (Luego los moveremos a sus propias carpetas) ---

function CatalogPlaceholder() {
  const { logout } = useAuth();
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Catálogo de Productos (Vista Lead/Cliente)</h1>
      <p>Aquí tu tía mostrará las fotos para que reserven 24hrs.</p>
      <button onClick={logout} style={{ padding: "10px", background: "red", color: "white", marginTop: "20px" }}>Cerrar Sesión</button>
    </div>
  );
}

function AdminPlaceholder() {
  const { logout } = useAuth();
  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "blue" }}>
      <h1>Panel de Administración (Solo Tu Tía)</h1>
      <p>Aquí subiremos el Excel y veremos las ganancias.</p>
      <button onClick={logout} style={{ padding: "10px", background: "red", color: "white", marginTop: "20px" }}>Cerrar Sesión</button>
    </div>
  );
}

function CashierPlaceholder() {
  const { logout } = useAuth();
  return (
    <div style={{ textAlign: "center", marginTop: "50px", color: "green" }}>
      <h1>Punto de Venta - POS (Solo Cajeras)</h1>
      <p>Aquí las cajeras cobrarán, sin ver costos ni ganancias.</p>
      <button onClick={logout} style={{ padding: "10px", background: "red", color: "white", marginTop: "20px" }}>Cerrar Sesión</button>
    </div>
  );
}

// --- APLICACIÓN PRINCIPAL ---

function App() {
  return (
    <Router>
      <Routes>
        {/* RUTA PÚBLICA: Todos pueden ver el Login */}
        <Route path="/login" element={<Login />} />

        {/* RUTAS PROTEGIDAS */}

        {/* 1. Vista Cliente / Lead (Cualquier usuario logueado o con rol 'lead') */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'cashier', 'lead']}>
              <CatalogPlaceholder />
            </ProtectedRoute>
          } 
        />

        {/* 2. Vista Admin (SOLO 'admin') */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPlaceholder />
            </ProtectedRoute>
          } 
        />

        {/* 3. Vista Cajera (Pueden entrar 'cashier' y 'admin' por si tu tía quiere cobrar) */}
        <Route 
          path="/cashier" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'cashier']}>
              <CashierPlaceholder />
            </ProtectedRoute>
          } 
        />

        {/* RUTA COMODÍN: Si alguien escribe una URL que no existe, lo mandamos al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;