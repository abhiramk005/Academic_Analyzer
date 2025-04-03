const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const authRouter = require("./routes/auth.route");

const analyticsRoutes = require('./routes/analytics');
const { handleError } = require("./middleware/error");
const studentRoutes = require("./routes/studentRoutes");
const academicRoutes = require("./routes/academic");
const adminRoutes = require("./routes/admin");
const trackProgressRoutes = require("./routes/trackProgress");

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Your React app's origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

app.use("/api/auth", authRouter);
app.use("/api/reporting",studentRoutes)
app.use('/api/analytics', analyticsRoutes);
app.use("/api/academic", academicRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/track-progress", trackProgressRoutes);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST",
    credentials: true,
  })
);

// Database connection
connectDB();

// Routes
app.use("/api", require("./routes/api"));

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Internal Server Error" });
// });

// Error handler
app.use(handleError);

// Start server


module.exports = app;