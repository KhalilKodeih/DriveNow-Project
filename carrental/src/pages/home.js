// src/pages/home.js
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./home.css";

const Home = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch cars from backend
  useEffect(() => {
    async function fetchCars() {
      try {
        const response = await fetch("http://localhost:5000/api/cars");
        const data = await response.json();
        setCars(data.slice(0, 6)); // Show first 6 cars
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch cars:", err);
        setLoading(false);
      }
    }
    fetchCars();
  }, []);

  return (
    <div className="car-landing">
      {/* HERO SECTION */}
      <section className="cl-hero">
        <div className="cl-overlay" />
        <div className="cl-container cl-hero-inner">
          <div className="cl-hero-text">
            <h1>Need a car today?</h1>
            <p>
              Book a reliable rental in minutes. Choose from economy, SUV, or
              luxury cars with 24/7 support and flexible pickup options.
            </p>
            <Link to="/cars" className="cl-btn cl-btn-primary">
              Book your car now
            </Link>
          </div>
          <div className="cl-hero-card">
            <h2>Pick up &amp; go</h2>
            <p>
              Reserve online and pick up your car at any of our city locations.
              No hidden fees, no surprises.
            </p>
            <ul>
              <li>✔ Free cancellation up to 24h</li>
              <li>✔ Unlimited mileage options</li>
              <li>✔ Insurance available</li>
            </ul>
          </div>
        </div>
      </section>

      {/* FEATURED CARS */}
      <section className="cl-section cl-cars">
        <div className="cl-container">
          <h2>Featured Cars</h2>
          <p className="cl-section-subtitle">
            Browse our most popular vehicles available for rent.
          </p>

          {loading ? (
            <p style={{ textAlign: "center" }}>Loading cars...</p>
          ) : cars.length === 0 ? (
            <p style={{ textAlign: "center" }}>
              No cars available at the moment.
            </p>
          ) : (
            <div className="cl-cars-grid">
              {cars.map((car) => (
                <div key={car.id} className="cl-car-card">
                  {car.image_base64 && (
                    <img
                      src={`data:image/jpeg;base64,${car.image_base64}`}
                      alt={`${car.brand} ${car.model}`}
                      className="cl-car-image"
                    />
                  )}
                  <div className="cl-car-info">
                    <h3>
                      {car.brand} {car.model}
                    </h3>
                    <p className="cl-car-year">{car.year}</p>
                    <p className="cl-car-price">${car.price_per_day}/day</p>
                    <Link
                      to={`/cars/${car.id}`}
                      className="cl-btn cl-btn-outline"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Link to="/cars" className="cl-btn cl-btn-primary">
              View All Cars
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="cl-section cl-features">
        <div className="cl-container cl-features-grid">
          <div className="cl-feature">
            <div className="cl-feature-icon">🚗</div>
            <h3>Wide car selection</h3>
            <p>
              From compact city cars to family SUVs and premium sedans, find a
              car that fits your trip.
            </p>
          </div>
          <div className="cl-feature">
            <div className="cl-feature-icon">⚡</div>
            <h3>Instant confirmation</h3>
            <p>
              Book online and receive your confirmation and pickup details in
              seconds.
            </p>
          </div>
          <div className="cl-feature">
            <div className="cl-feature-icon">💳</div>
            <h3>No hidden charges</h3>
            <p>
              Clear pricing with taxes and basic fees included before you pay.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="cl-section cl-steps">
        <div className="cl-container">
          <h2>This is how it works</h2>
          <p className="cl-section-subtitle">
            Renting a car with us takes just three simple steps.
          </p>

          <div className="cl-steps-timeline">
            <div className="cl-step">
              <div className="cl-step-circle">1</div>
              <h4>Choose your dates</h4>
              <p>
                Select pickup &amp; drop-off dates and your preferred location.
              </p>
            </div>
            <div className="cl-step">
              <div className="cl-step-circle">2</div>
              <h4>Select your car</h4>
              <p>
                Browse available cars, compare options, and pick your favorite.
              </p>
            </div>
            <div className="cl-step">
              <div className="cl-step-circle">3</div>
              <h4>Pick up &amp; drive</h4>
              <p>Show your ID, grab the keys, and hit the road in minutes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FIND THE RIGHT CAR */}
      <section id="cars" className="cl-section cl-cta">
        <div className="cl-container cl-cta-inner">
          <div>
            <h2>Find the right car for you</h2>
            <p>
              Tell us where and when you need a car, and we'll show you the best
              offers from our fleet.
            </p>
          </div>
          <Link to="/cars" className="cl-btn cl-btn-primary">
            Check availability
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
