// src/components/CarCard.js
import { Link } from "react-router-dom";
import "./CarCard.css";

function CarCard({ car }) {
  // Handle missing car data
  if (!car) {
    return null;
  }

  // Convert base64 string to displayable image URL
  const imageSrc = car.image_base64
    ? `data:image/jpeg;base64,${car.image_base64}`
    : "https://via.placeholder.com/300x200?text=No+Image";

  return (
    <div className="car-card">
      <img
        src={imageSrc}
        alt={`${car.brand} ${car.model}`}
        className="car-card__image"
        onError={(e) => {
          e.target.src = "https://via.placeholder.com/300x200?text=No+Image";
        }}
      />

      <div className="car-card__body">
        <h3 className="car-card__title">
          {car.brand} {car.model}
        </h3>

        <p className="car-card__info">
          {car.year} • {car.status || "Available"}
        </p>

        <p className="car-card__price">${car.price_per_day}/day</p>

        <Link to={`/cars/${car.id}`} className="btn btn-primary">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default CarCard;
