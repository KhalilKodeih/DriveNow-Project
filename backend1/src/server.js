const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json({ limit: "50mb" }));

// MySQL Connection Pool
const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "car_rental",
  waitForConnections: true,
  connectionLimit: 10,
});

// Test database connection
db.getConnection((err, connection) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("✅ MySQL connected");
    connection.release();
  }
});

// ============ USER ENDPOINTS ============

// Register new user
app.post("/api/users/register", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const sql = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
  db.query(sql, [name, email, password], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ message: "Email already exists" });
      }
      return res.status(500).json(err);
    }
    res.status(201).json({ id: result.insertId, name, email });
  });
});

// User login
app.post("/api/users/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const sql =
    "SELECT id, name, email FROM users WHERE email = ? AND password = ?";
  db.query(sql, [email, password], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    res.json(results[0]);
  });
});

// Get all users
app.get("/api/users", (req, res) => {
  db.query("SELECT id, name, email FROM users", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// ============ CAR ENDPOINTS ============

// Get all cars
app.get("/api/cars", (req, res) => {
  db.query("SELECT * FROM cars", (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Get single car by ID
app.get("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM cars WHERE id = ?", [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json(results[0]);
  });
});

// Create new car
app.post("/api/cars", (req, res) => {
  const { brand, model, year, type, price_per_day, status, image_base64 } =
    req.body;

  if (!brand || !model || !year || !price_per_day) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const sql = `INSERT INTO cars (brand, model, year, type, price_per_day, status, image_base64) 
               VALUES (?, ?, ?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [
      brand,
      model,
      year,
      type || "Economy",
      price_per_day,
      status || "Available",
      image_base64 || null,
    ],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res.status(201).json({ id: result.insertId, brand, model });
    },
  );
});

// Update car
app.put("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  const { brand, model, year, type, price_per_day, status, image_base64 } =
    req.body;

  const sql = `UPDATE cars SET brand = ?, model = ?, year = ?, type = ?, 
               price_per_day = ?, status = ?, image_base64 = ? WHERE id = ?`;
  db.query(
    sql,
    [brand, model, year, type, price_per_day, status, image_base64, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Car not found" });
      }
      res.json({ message: "Car updated successfully" });
    },
  );
});

// Delete car
app.delete("/api/cars/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM cars WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json(err);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Car not found" });
    }
    res.json({ message: "Car deleted successfully" });
  });
});

// ============ ORDER ENDPOINTS ============

// Get all orders with user and car info
app.get("/api/orders", (req, res) => {
  const sql = `
    SELECT o.*, u.name AS user_name, u.email AS user_email,
           c.brand, c.model, c.price_per_day
    FROM orders o
    JOIN users u ON o.user_id = u.id
    JOIN cars c ON o.car_id = c.id
    ORDER BY o.created_at DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Create new order
app.post("/api/orders", (req, res) => {
  const { user_id, car_id, start_date, end_date, pickup_location } = req.body;

  if (!user_id || !car_id || !start_date || !end_date) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  const sql = `INSERT INTO orders (user_id, car_id, start_date, end_date, pickup_location, status) 
               VALUES (?, ?, ?, ?, ?, 'active')`;
  db.query(
    sql,
    [user_id, car_id, start_date, end_date, pickup_location || "Main Office"],
    (err, result) => {
      if (err) return res.status(500).json(err);
      res
        .status(201)
        .json({ id: result.insertId, message: "Order created successfully" });
    },
  );
});

// Update order status
app.put("/api/orders/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !["active", "completed", "cancelled"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  db.query(
    "UPDATE orders SET status = ? WHERE id = ?",
    [status, id],
    (err, result) => {
      if (err) return res.status(500).json(err);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json({ message: "Order status updated" });
    },
  );
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
