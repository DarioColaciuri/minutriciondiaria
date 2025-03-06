import React, { useState } from "react";
import { ClipLoader } from "react-spinners";

const MealForm = ({
  title,
  setTitle,
  description,
  setDescription,
  imageUrl,
  setImageUrl,
  type,
  setType,
  protein,
  setProtein,
  isLoading,
  isUploading,
  handleImageUpload,
  handleAddMeal,
}) => {
  return (
    <form className="dashboard-form" onSubmit={handleAddMeal}>
      <input
        className="title-input"
        type="text"
        placeholder="Título de la comida"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <input
        className="description-input"
        type="text"
        placeholder="Descripción de la comida"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        className="file-input"
        type="file"
        onChange={(e) => handleImageUpload(e.target.files[0])}
        disabled={isUploading}
        required
      />
      {isUploading && <ClipLoader size={20} color="#007bff" />}
      <select
        className="selector"
        value={type}
        onChange={(e) => setType(e.target.value)}
        required
      >
        <option value="Desayuno">Desayuno</option>
        <option value="Almuerzo">Almuerzo</option>
        <option value="Merienda">Merienda</option>
        <option value="Cena">Cena</option>
        <option value="Colación">Colación</option>
      </select>
      <input
        className="protein-input"
        type="number"
        placeholder="Cantidad de proteínas (en gramos)"
        value={protein}
        onChange={(e) => setProtein(e.target.value)}
        required
      />
      <button
        className="add-meal-button"
        type="submit"
        disabled={isLoading || isUploading}
      >
        {isLoading ? (
          <ClipLoader size={20} color="#ffffff" />
        ) : (
          "Agregar Comida"
        )}
      </button>
      <p>
        Por favor usar{" "}
        <a className="link" target="_blank" href="https://squoosh.app/">
          Squoosh
        </a>{" "}
        para reducir el tamaño de la imagen. Compress Webp y que pese menos de
        200kb.
      </p>
    </form>
  );
};

export default MealForm;
