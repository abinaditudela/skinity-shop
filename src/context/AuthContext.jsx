import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { auth, db } from "../config/firebase";
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Función lógica de inicio de sesión
  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Función lógica de cierre de sesión
  const logout = () => {
    // No necesitas setRole(null) aquí, onAuthStateChanged lo hará automáticamente al detectar el cierre
    return signOut(auth);
  };

  // Observador en tiempo real del estado de la sesión
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        try {
          // Patrón RBAC (Role-Based Access Control)
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setRole(docSnap.data().role);
          } else {
            setRole('lead'); // Rol por defecto (Cliente)
          }
        } catch (error) {
          console.error("Error al obtener el rol del usuario:", error);
          setRole('lead'); // En caso de error de red, lo dejamos como cliente por seguridad
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // useMemo memoriza los valores para evitar renderizados innecesarios en toda la app
  const value = useMemo(() => ({
    user,
    role,
    loading,
    login,
    logout
  }), [user, role, loading]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook personalizado para consumir el contexto
export const useAuth = () => useContext(AuthContext);