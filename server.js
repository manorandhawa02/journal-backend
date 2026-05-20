const express = require("express");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // ✅ ADD THIS
const paperRoutes = require("./routes/paperRoutes");


const app = express();

// Connect DB
connectDB();

// Middleware
const cors = require("cors");

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Routes ✅ ADD THIS


app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/journal", require("./routes/journalRoutes"));
app.use("/api/paper", require("./routes/paperRoutes"));
app.use("/api/review", require("./routes/reviewRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));


// Test route
app.get("/", (req, res) => {
  res.send("Server Running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});