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

  // Obtener las fechas (días) de las comidas
  const dates = Object.keys(meals);

  return (
    <div className="meals-list">
      <h2>Mis Comidas</h2>
      {isLoading ? (
        <div style={{ textAlign: "center" }}>
          <ClipLoader size={30} color="#007bff" />
        </div>
      ) : dates.length === 0 ? (
        <p>No hay comidas registradas.</p>
      ) : (
        dates.map((date, index) => (
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
                <p className="description">{meal.description}</p>
                <p className="proteins">Proteínas: {meal.protein}g</p>
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
                    <i title="Eliminar" className="bi bi-trash3"></i>
                  )}
                </button>
              </div>
            ))}
            {/* Agregar un separador <hr /> después de cada día, excepto el último */}
            {index < dates.length - 1 && <hr className="day-separator" />}
          </div>
        ))
      )}
    </div>
  );
};

export default MealList;
