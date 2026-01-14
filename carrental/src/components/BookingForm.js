// src/components/BookingForm.js
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Lock } from "lucide-react";
import "./BookingForm.css";

function BookingForm({ carName, carId }) {
  const { user, isLoggedIn } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        fullName: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setForm((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === "pickupDate" && prev.returnDate && value > prev.returnDate) {
        updated.returnDate = "";
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!isLoggedIn()) return;

    if (form.pickupDate >= form.returnDate) {
      setError("Return date must be after pickup date");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          car_id: carId,
          start_date: form.pickupDate,
          end_date: form.returnDate,
          pickup_location: form.pickupLocation,
        }),
      });

      if (response.ok) {
        setSuccess(true);
      } else {
        const data = await response.json();
        setError(data.message || "Booking failed. Please try again.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Failed to submit booking. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isLoggedIn()) {
    return (
      <div className="booking-form booking-form--locked">
        <div className="booking-form__lock-overlay">
          <Lock size={48} />
          <h3>Login Required</h3>
          <p>You need to be logged in to rent a car</p>
          <div className="booking-form__auth-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="booking-form booking-form--success">
        <div className="booking-form__success-message">
          <h3>🎉 Booking Submitted!</h3>
          <p>
            Your booking request for {carName} has been submitted successfully.
          </p>
          <p>
            We will contact you at {form.email} to confirm your reservation.
          </p>
          <Link to="/cars" className="btn btn-primary">
            Browse More Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Book {carName}</h3>

      {error && <div className="booking-form__error">{error}</div>}

      <input
        type="text"
        name="fullName"
        placeholder="Full Name"
        value={form.fullName}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <div className="booking-form__row">
        <div>
          <label>Pickup Date</label>
          <input
            type="date"
            name="pickupDate"
            value={form.pickupDate}
            onChange={handleChange}
            min={today}
            required
          />
        </div>
        <div>
          <label>Return Date</label>
          <input
            type="date"
            name="returnDate"
            value={form.returnDate}
            onChange={handleChange}
            min={form.pickupDate || today}
            required
          />
        </div>
      </div>
      <input
        type="text"
        name="pickupLocation"
        placeholder="Pickup Location"
        value={form.pickupLocation}
        onChange={handleChange}
        required
      />
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? "Submitting..." : "Submit Request"}
      </button>
    </form>
  );
}

export default BookingForm;
