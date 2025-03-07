import React from "react";
import { ClipLoader } from "react-spinners";

const MealItem = ({ meal, handleDeleteMeal, isLoading }) => {
  return (
    <div className="meal-item">
      <h4>{meal.title}</h4>
      <p>{meal.type}</p>
      <img src={meal.imageUrl} alt={meal.title} />
      <p className="description">{meal.description}</p>
      {/* Mostrar el horario solo si está presente */}
      {meal.schedule && <p className="schedule">Horario: {meal.schedule}</p>}
      <p>Proteínas: {meal.protein}g</p>
      <p>
        <small>{meal.timestamp?.toDate().toLocaleTimeString()}</small>
      </p>
      <button onClick={() => handleDeleteMeal(meal.id)} disabled={isLoading}>
        {isLoading ? (
          <ClipLoader size={20} color="#ffffff" />
        ) : (
          <i className="bi bi-trash3"></i>
        )}
      </button>
    </div>
  );
};

export default MealItem;
