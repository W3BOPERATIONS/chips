const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()

// Middleware
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5173", "https://your-frontend-domain.vercel.app"],
    credentials: true,
  }),
)
app.use(express.json())

// MongoDB Connection
let isConnected = false

const connectDB = async () => {
  if (isConnected) {
    return
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    })

    isConnected = true
    console.log("✅ MongoDB Atlas connected successfully")
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message)
    throw err
  }
}

// Connect to database before handling requests
app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    res.status(500).json({ error: "Database connection failed" })
  }
})

// Routes
app.use("/api/products", require("../routes/products"))
app.use("/api/orders", require("../routes/orders"))
app.use("/api/admin", require("../routes/admin"))
app.use("/api/auth", require("../routes/auth"))
app.use("/api/reviews", require("../routes/reviews"))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running!",
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    database: mongoose.connection.name,
    timestamp: new Date().toISOString(),
  })
})

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "ChipsStore API is running!",
    endpoints: ["/api/health", "/api/auth", "/api/products", "/api/orders", "/api/admin", "/api/reviews"],
  })
})

// Handle 404
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    message: "The requested endpoint does not exist",
  })
})

module.exports = app
