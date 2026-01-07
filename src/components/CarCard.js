// src/components/CarCard.js
import { Link } from "react-router-dom";
import "./carCard.css";

function CarCard({ car }) {
  // Convert base64 string to displayable image URL
  const imageSrc = `data:image/jpeg;base64,${car.image_base64}`;

  return (
    <div className="car-card">
      <img
        src={`data:image/jpeg;base64,${car.image_base64}`}
        alt={car.name}
        className="car-card__image"
      />

      <div className="car-card__body">
        <h3>{car.name}</h3>

        <p className="car-card__price">${car.price_per_day}/day</p>

        <Link to={`/cars/${car.id}`} className="btn">
          View Details
        </Link>
      </div>
    </div>
  );
}

export default CarCard;
