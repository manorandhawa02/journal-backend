const express = require("express");
const app = express();
require("dotenv").config();

const cors = require("cors");

// DB
const connectDB = require("./config/db");

// ROUTES
const authRoutes = require("./routes/authRoutes");
const paperRoutes = require("./routes/paperRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const adminRoutes = require("./routes/adminRoutes");
const journalRoutes = require("./routes/journalRoutes");
const publishedRoutes = require("./routes/publishedRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

// ================= CONNECT DB =================
connectDB();

// ================= MIDDLEWARE =================
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/paper", paperRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/journal", journalRoutes);
app.use("/api/published", publishedRoutes);
app.use("/api/notifications", notificationRoutes);

// ================= TEST ROUTE =================
app.get("/", (req, res) => {
  res.send("🚀 Server Running...");
});

// ================= START SERVER =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});