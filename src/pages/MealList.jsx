import React from "react";
import { ClipLoader } from "react-spinners";

const MealList = ({ meals, handleDeleteMeal, isLoading }) => {
  // Función para generar un border-radius aleatorio
  const getRandomBorderRadius = () => {
    const values = [];
    for (let i = 0; i < 4; i++) {
      values.push(`${Math.floor(Math.random() * 70) + 30}%`); // Genera valores entre 30% y 100%
    }
    return `${values[0]} ${values[1]} ${values[2]} ${values[3]}`;
  };

  return (
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
            <h3>{date}</h3> {/* Mostrar la fecha */}
            {meals[date].map((meal) => (
              <div key={meal.id} className="meal-item">
                <h4>{meal.title}</h4>
                <p>{meal.type}</p>
                <img
                  src={meal.imageUrl}
                  alt={meal.title}
                  style={{
                    borderRadius: getRandomBorderRadius(), // Aplica el border-radius aleatorio
                  }}
                />
                <p>{meal.description}</p>
                <p>Proteínas: {meal.protein}g</p>
                <p>
                  <small>{meal.timestamp?.toDate().toLocaleTimeString()}</small>
                </p>
                <button
                  onClick={() => handleDeleteMeal(meal.id)}
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
  );
};

export default MealList;
