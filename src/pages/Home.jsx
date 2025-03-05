import React, { useState } from "react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast"; // Importa la función de notificación
import "../css/home.css";

const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      showToast("Inicio de sesión exitoso", "success"); // Notificación de éxito
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión:", error.message);
      showToast("Error al iniciar sesión: " + error.message, "error"); // Notificación de error
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      showToast("Inicio de sesión con Google exitoso", "success"); // Notificación de éxito
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al iniciar sesión con Google:", error.message);
      showToast(
        "Error al iniciar sesión con Google: " + error.message,
        "error"
      ); // Notificación de error
    }
  };

  return (
    <div className="home">
      <h1>Iniciar Sesión</h1>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar Sesión</button>
      </form>
      <button className="google" onClick={handleGoogleLogin}>
        <i className="bi bi-google"></i>
      </button>
      <button onClick={() => navigate("/register")}>Registrarse</button>
    </div>
  );
};

export default Home;
