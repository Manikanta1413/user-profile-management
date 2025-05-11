const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const logger = require("./utils/logger");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const { errorHandler } = require("./middlewares/errorHandler.middleware");

dotenv.config();

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again later.",
});

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, true);
  },
  credentials: true,
};
// Middlewares
app.use(helmet());
app.use(
  cors(corsOptions)
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(limiter);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger File for Routes
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const swaggerDocument = require("./docs/swagger.json"); // Adjust path relative to server.js
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Routes
app.get("/", (req, res) => {
  res.send("User Management API is running");
});
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  await connectDB();

  if (process.env.NODE_ENV !== "test") {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      logger.info(`Server running on port ... ${PORT}`);
    });
  }
};

startServer();

module.exports = app;

