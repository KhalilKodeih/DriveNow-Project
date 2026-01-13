// src/components/BookingForm.js
import { useState } from "react";
import "./BookingForm.css";

function BookingForm({ carName }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    pickupDate: "",
    returnDate: "",
    pickupLocation: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Booking request submitted for ${carName}! (Frontend only)`);
  };

  return (
    <form className="booking-form" onSubmit={handleSubmit}>
      <h3>Book {carName}</h3>
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
      <button type="submit" className="btn btn-primary">
        Submit Request
      </button>
    </form>
  );
}

export default BookingForm;
