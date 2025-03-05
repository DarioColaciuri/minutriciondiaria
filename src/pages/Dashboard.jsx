import React, { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast";
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { ClipLoader } from "react-spinners";
import "../css/dashboard.css";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("Desayuno");
  const [protein, setProtein] = useState("");
  const [meals, setMeals] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Estado para la subida de imágenes
  const navigate = useNavigate();

  // Obtener el ID del usuario actual
  const userId = auth.currentUser?.uid;

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

  // Función para subir la imagen a Cloudinary
  const handleImageUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "meal_images"); // Usa el nombre de tu upload preset

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dijovy9tl/image/upload`, // Reemplaza "tu_cloud_name"
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setImageUrl(data.secure_url); // URL de la imagen subida
      showToast("Imagen subida correctamente", "success");
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      showToast("Error al subir la imagen", "error");
    } finally {
      setIsUploading(false);
    }
  };

  // Función para agregar una nueva comida
  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!title || !description || !imageUrl || !type || !protein) {
      showToast("Todos los campos son obligatorios", "error");
      return;
    }

    setIsLoading(true);
    try {
      await addDoc(collection(db, "meals"), {
        userId,
        title,
        description,
        imageUrl,
        type,
        protein: parseFloat(protein),
        timestamp: serverTimestamp(),
      });
      showToast("Comida agregada correctamente", "success");
      setTitle("");
      setDescription("");
      setImageUrl("");
      setType("Desayuno");
      setProtein("");
    } catch (error) {
      console.error("Error al agregar la comida:", error.message);
      showToast("Error al agregar la comida: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar una comida
  const handleDeleteMeal = async (mealId) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "meals", mealId));
      showToast("Comida eliminada correctamente", "success");
    } catch (error) {
      console.error("Error al eliminar la comida:", error.message);
      showToast("Error al eliminar la comida: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para agrupar y ordenar las comidas por día y hora
  const groupAndSortMeals = (meals) => {
    const groupedMeals = {};

    meals.forEach((meal) => {
      const date = meal.timestamp?.toDate().toLocaleDateString();
      if (!groupedMeals[date]) {
        groupedMeals[date] = [];
      }
      groupedMeals[date].push(meal);
    });

    Object.keys(groupedMeals).forEach((date) => {
      groupedMeals[date].sort(
        (a, b) => a.timestamp?.toDate() - b.timestamp?.toDate()
      );
    });

    return groupedMeals;
  };

  // Obtener las comidas del usuario actual
  useEffect(() => {
    if (!userId) return;

    const q = query(collection(db, "meals"), where("userId", "==", userId));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const mealsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const groupedMeals = groupAndSortMeals(mealsData);
      setMeals(groupedMeals);
    });

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <button onClick={handleLogout}>Cerrar Sesión</button>

      {/* Formulario para agregar comidas */}
      <form onSubmit={handleAddMeal}>
        <input
          type="text"
          placeholder="Título de la comida"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Descripción de la comida"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
        <input
          type="file"
          onChange={(e) => handleImageUpload(e.target.files[0])}
          disabled={isUploading}
          required
        />
        {isUploading && <ClipLoader size={20} color="#007bff" />}
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="Desayuno">Desayuno</option>
          <option value="Almuerzo">Almuerzo</option>
          <option value="Merienda">Merienda</option>
          <option value="Cena">Cena</option>
          <option value="Colación">Colacion</option>
        </select>
        <input
          type="number"
          placeholder="Cantidad de proteínas (en gramos)"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading || isUploading}>
          {isLoading ? (
            <ClipLoader size={20} color="#ffffff" />
          ) : (
            "Agregar Comida"
          )}
        </button>
      </form>

      {/* Lista de comidas */}
      <div className="meals-list">
        <h2>Mis Comidas</h2>
        {isLoading ? (
          <div style={{ textAlign: "center" }}>
            <ClipLoader size={30} color="#007bff" />
          </div>
        ) : Object.keys(meals).length === 0 ? (
          <p>No hay comidas registradas.</p>
        ) : (
          Object.keys(meals).map((date) => (
            <div key={date}>
              <h3>{date}</h3>
              {meals[date].map((meal) => (
                <div key={meal.id} className="meal-item">
                  <h4>{meal.title}</h4>
                  <p>{meal.type}</p>
                  <img
                    src={meal.imageUrl}
                    alt={meal.title}
                    style={{ width: "50%", height: "auto" }}
                  />
                  <p>{meal.description}</p>
                  <p>Proteínas: {meal.protein}g</p>
                  <p>
                    <small>
                      {meal.timestamp?.toDate().toLocaleTimeString()}
                    </small>
                  </p>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    style={{ backgroundColor: "#dc3545", marginTop: "10px" }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <ClipLoader size={20} color="#ffffff" />
                    ) : (
                      "Eliminar"
                    )}
                  </button>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
