const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      "https://your-frontend-domain.vercel.app",
      /\.vercel\.app$/,
    ],
    credentials: true,
  }),
)
app.use(express.json())

// MongoDB Connection with serverless optimization
let isConnected = false

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return
  }

  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI environment variable is not set")
    }

    const mongoURI = process.env.MONGODB_URI

    console.log("🔄 Connecting to MongoDB Atlas...")
    console.log("📍 Using Atlas cluster:", mongoURI.includes("mongodb.net") ? "✅ Atlas" : "❌ Local")

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      bufferCommands: false,
      bufferMaxEntries: 0,
    })

    isConnected = true
    console.log("✅ MongoDB Atlas connected successfully")
    console.log("📊 Database:", mongoose.connection.name)
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message)
    console.error("💡 Check your .env file and MongoDB Atlas connection string")
    console.error("🔍 Current MONGODB_URI exists:", !!process.env.MONGODB_URI)
    isConnected = false
    throw err
  }
}

app.use(async (req, res, next) => {
  try {
    await connectDB()
    next()
  } catch (error) {
    console.error("Database connection failed:", error)
    res.status(500).json({
      error: "Database connection failed",
      message: "Unable to connect to MongoDB Atlas",
    })
  }
})

// Routes
app.use("/api/products", require("./routes/products"))
app.use("/api/orders", require("./routes/orders"))
app.use("/api/admin", require("./routes/admin"))
app.use("/api/auth", require("./routes/auth"))
app.use("/api/reviews", require("./routes/reviews"))

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    message: "Server is running!",
    mongodb: mongoose.connection.readyState === 1 ? "Connected" : "Disconnected",
    database: mongoose.connection.name,
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  })
})

app.get("/", (req, res) => {
  res.json({
    message: "ChipsStore API is running!",
    version: "1.0.0",
    endpoints: ["/api/health", "/api/auth", "/api/products", "/api/orders", "/api/admin", "/api/reviews"],
    status: "active",
    timestamp: new Date().toISOString(),
  })
})

app.use("*", (req, res) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    message: "The requested endpoint does not exist",
    availableEndpoints: ["/api/health", "/api/auth", "/api/products", "/api/orders", "/api/admin", "/api/reviews"],
  })
})

if (process.env.NODE_ENV === "production") {
  module.exports = app
} else {
  // For local development
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
    console.log(`🔍 Environment: ${process.env.NODE_ENV || "development"}`)
    console.log(`📊 MongoDB URI configured: ${!!process.env.MONGODB_URI}`)
  })
}

process.on("SIGINT", async () => {
  console.log("\n🔄 Shutting down gracefully...")
  await mongoose.connection.close()
  console.log("✅ MongoDB connection closed")
  process.exit(0)
})
