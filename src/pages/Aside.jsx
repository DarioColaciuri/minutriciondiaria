import React from "react";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";

const Aside = () => {
  const navigate = useNavigate();
  const user = auth.currentUser; // Obtener el usuario actual

  // Función para manejar el cierre de sesión
  const handleLogout = async () => {
    try {
      await auth.signOut();
      showToast("Sesión cerrada correctamente", "success");
      navigate("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error.message);
      showToast("Error al cerrar sesión: " + error.message, "error");
    }
  };

  return (
    <aside className="aside">
      <h1>Dashboard</h1>
      <p>Bienvenido, {user?.displayName || user?.email}</p>
      <button onClick={handleLogout}>
        <i title="Cerrar Sesión" className="bi bi-x-circle"></i>
      </button>
    </aside>
  );
};

export default Aside;
