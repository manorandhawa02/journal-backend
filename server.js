const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes"); // ✅ ADD THIS
const paperRoutes = require("./routes/paperRoutes");


const app = express();

// Connect DB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes ✅ ADD THIS
app.use("/api/auth", authRoutes);
app.use("/api/journals", require("./routes/journalRoutes"));
app.use("/api/papers", paperRoutes);
app.use("/api/reviews", require("./routes/reviewRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));


// Test route
app.get("/", (req, res) => {
  res.send("Server Running...");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});