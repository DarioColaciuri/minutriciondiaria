import React, { useState, useEffect } from "react";
import { auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { showToast } from "../utils/toast"; // Importar showToast
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
import MealForm from "./MealForm";
import MealList from "./MealList";
import Aside from "./Aside";
import "../css/dashboard.css";

const Dashboard = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [type, setType] = useState("Desayuno");
  const [protein, setProtein] = useState("");
  const [meals, setMeals] = useState({}); // meals es un objeto
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Obtener el ID del usuario actual
  const userId = auth.currentUser?.uid;

  // Función para subir la imagen a Cloudinary
  const handleImageUpload = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "meal_images");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/dijovy9tl/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      setImageUrl(data.secure_url);
      showToast("Imagen subida correctamente", "success"); // Usar showToast
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      showToast("Error al subir la imagen", "error"); // Usar showToast
    } finally {
      setIsUploading(false);
    }
  };

  // Función para agregar una nueva comida
  const handleAddMeal = async (e) => {
    e.preventDefault();
    if (!title || !description || !imageUrl || !type || !protein) {
      showToast("Todos los campos son obligatorios", "error"); // Usar showToast
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
      showToast("Comida agregada correctamente", "success"); // Usar showToast
      setTitle("");
      setDescription("");
      setImageUrl("");
      setType("Desayuno");
      setProtein("");
    } catch (error) {
      console.error("Error al agregar la comida:", error.message);
      showToast("Error al agregar la comida: " + error.message, "error"); // Usar showToast
    } finally {
      setIsLoading(false);
    }
  };

  // Función para eliminar una comida
  const handleDeleteMeal = async (mealId) => {
    setIsLoading(true);
    try {
      await deleteDoc(doc(db, "meals", mealId));
      showToast("Comida eliminada correctamente", "success"); // Usar showToast
    } catch (error) {
      console.error("Error al eliminar la comida:", error.message);
      showToast("Error al eliminar la comida: " + error.message, "error"); // Usar showToast
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
    <div className="dashboard-container">
      {/* Aside */}
      <Aside />

      {/* Contenido principal */}
      <main className="main-content">
        {/* Formulario para agregar comidas */}
        <MealForm
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          type={type}
          setType={setType}
          protein={protein}
          setProtein={setProtein}
          isLoading={isLoading}
          isUploading={isUploading}
          handleImageUpload={handleImageUpload}
          handleAddMeal={handleAddMeal}
        />

        {/* Lista de comidas */}
        <MealList
          meals={meals}
          handleDeleteMeal={handleDeleteMeal}
          isLoading={isLoading}
        />
      </main>
    </div>
  );
};

export default Dashboard;
