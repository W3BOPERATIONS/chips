const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const dotenv = require("dotenv")

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())

// MongoDB Connection
const connectDB = async () => {
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
    })

    console.log("✅ MongoDB Atlas connected successfully")
    console.log("📊 Database:", mongoose.connection.name)
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message)
    console.error("💡 Check your .env file and MongoDB Atlas connection string")
    console.error("🔍 Current MONGODB_URI exists:", !!process.env.MONGODB_URI)
    process.exit(1)
  }
}

// Connect to database
connectDB()

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
  })
})

process.on("SIGINT", async () => {
  console.log("\n🔄 Shutting down gracefully...")
  await mongoose.connection.close()
  console.log("✅ MongoDB connection closed")
  process.exit(0)
})

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`🔍 Environment: ${process.env.NODE_ENV || "development"}`)
  console.log(`📊 MongoDB URI configured: ${!!process.env.MONGODB_URI}`)
})
