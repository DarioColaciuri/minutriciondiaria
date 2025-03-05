import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast"; // Importa la función de notificación
import "../css/home.css";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      showToast("Registro exitoso", "success"); // Notificación de éxito
      navigate("/dashboard");
    } catch (error) {
      console.error("Error al registrarse:", error.message);
      showToast("Error al registrarse: " + error.message, "error"); // Notificación de error
    }
  };

  return (
    <div className="home">
      <h1>Registrarse</h1>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
