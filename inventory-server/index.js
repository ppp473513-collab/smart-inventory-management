const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

require("dotenv").config();

// ==========================================
// ROUTES
// ==========================================

const authRoutes = require("./routes/auth");
const productRoutes = require("./routes/product");
const stockRoutes = require("./routes/stockRoutes");
const userRoutes = require("./routes/userRoutes");
const auditRoutes = require("./routes/auditRoutes");
const adminRoutes = require("./routes/adminRoutes");

// ==========================================
// APP
// ==========================================

const app = express();

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());

// ==========================================
// API ROUTES
// ==========================================

// Authentication
app.use(
  "/api/auth",
  authRoutes
);

// Products
app.use(
  "/api/products",
  productRoutes
);

// Stock
app.use(
  "/api/stock",
  stockRoutes
);

// Users - Admin protected inside route
app.use(
  "/api/users",
  userRoutes
);

// Audit Logs - Admin protected inside route
app.use(
  "/api/audit",
  auditRoutes
);
app.use(
  "/api/admin",
  adminRoutes
);


// ==========================================
// HEALTH CHECK
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message:
      "Smart Inventory Management API is running",
  });
});

// ==========================================
// 404 API HANDLER
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// ==========================================
// GLOBAL ERROR HANDLER
// ==========================================

app.use(
  (error, req, res, next) => {
    console.error(
      "GLOBAL SERVER ERROR:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Internal server error",
    });
  }
);

// ==========================================
// MONGODB CONNECTION
// ==========================================

const MONGO_URI =
  process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error(
    "ERROR: MONGO_URI is not defined in .env"
  );

  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error(
    "ERROR: JWT_SECRET is not defined in .env"
  );

  process.exit(1);
}

// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log(
      "MongoDB connected successfully"
    );

    app.listen(
      PORT,
      () => {
        console.log(
          `Server running on http://localhost:${PORT}`
        );
      }
    );
  })
  .catch((error) => {
    console.error(
      "MongoDB connection failed:",
      error.message
    );

    process.exit(1);
  });