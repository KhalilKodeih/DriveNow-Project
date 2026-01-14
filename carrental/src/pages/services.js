// src/pages/services.js
function Services() {
  return (
    <section className="page">
      <h1>Our Services</h1>
      <div className="services-grid">
        <div className="service-card">
          <h3>Daily & Weekly Rentals</h3>
          <p>Short trips or extended stays with flexible pricing plans.</p>
        </div>
        <div className="service-card">
          <h3>Airport Pickup</h3>
          <p>Skip the taxi line. Pick up your car directly at the airport.</p>
        </div>
        <div className="service-card">
          <h3>Long-Term Leasing</h3>
          <p>Affordable monthly plans for professionals and expats.</p>
        </div>
        <div className="service-card">
          <h3>Chauffeur Service</h3>
          <p>Professional drivers for business events and special occasions.</p>
        </div>
      </div>
    </section>
  );
}

export default Services;
