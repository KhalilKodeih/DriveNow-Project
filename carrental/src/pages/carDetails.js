// src/pages/carDetails.js
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import BookingForm from "../components/BookingForm";
import "./carDetails.css";

function CarDetails() {
  const { id } = useParams();

  const [car, setCar] = useState(null); // state to hold car from API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await fetch(`http://localhost:5000/api/cars`);

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`HTTP ${res.status} - ${text}`);
        }

        const data = await res.json();
        console.log("All cars from API:", data);

        // convert id to number for comparison
        const carId = Number(id);

        // find the specific car from API array
        const found = data.find((c) => c.id === carId);

        setCar(found || null);
        setLoading(false);
      } catch (err) {
        console.error("Fetch car error:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    fetchCar();
  }, [id]);

  if (loading) {
    return <p>Loading car details...</p>;
  }

  if (error) {
    return (
      <section className="page">
        <h1>Error loading car</h1>
        <p>{error}</p>
        <Link to="/cars" className="btn">
          Back to cars
        </Link>
      </section>
    );
  }

  if (!car) {
    return (
      <section className="page">
        <h1>Car not found</h1>
        <Link to="/cars" className="btn">
          Back to cars
        </Link>
      </section>
    );
  }

  // Convert base64 image to usable URL
  const imageSrc = car.image_base64
    ? `data:image/jpeg;base64,${car.image_base64}`
    : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <section className="page car-details">
      <div className="car-details__info">
        <img src={imageSrc} alt={`${car.brand} ${car.model}`} />

        <div>
          <h1>
            {car.brand} {car.model}
          </h1>

          <p>{car.description || "No description available."}</p>

          <ul>
            <li>Year: {car.year}</li>
            <li>Status: {car.status || "Available"}</li>
          </ul>

          <p className="car-details__price">${car.price_per_day} / day</p>
        </div>
      </div>

      <BookingForm
        carName={`${car.brand} ${car.model}`}
        carId={car.id}
        pricePerDay={car.price_per_day}
      />
    </section>
  );
}

export default CarDetails;
