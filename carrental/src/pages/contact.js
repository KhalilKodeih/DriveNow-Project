// src/pages/contact.js
import { useState } from "react";
import "./contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent! (Frontend only)");
  };

  return (
    <section className="page">
      <h1>Contact Us</h1>
      <div className="contact-layout">
        <form className="contact-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
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
          <textarea
            name="message"
            rows="5"
            placeholder="How can we help you?"
            value={form.message}
            onChange={handleChange}
            required
          />
          <button className="btn btn-primary">Send Message</button>
        </form>

        <div className="contact-info">
          <h3>Our Office</h3>
          <p>Beirut, Lebanon</p>
          <p>Phone: +961 3 000 000</p>
          <p>Email: support@drivenow.com</p>
          <p>Working Hours: 9:00 AM – 7:00 PM</p>
        </div>
      </div>
    </section>
  );
}

export default Contact;
