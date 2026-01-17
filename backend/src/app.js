const express = require("express");
require("./config/env"); // Load .env
const routes = require("../src/routes");
const errorMiddleware = require("./middlewares/error.middleware");
const app = express();
const path = require("path");
const swaggerDocs = require("./config/swagger");
const cors = require("cors");

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use("/assets", express.static(path.join(__dirname, "public/assets")));
app.use("/chat_files", express.static(path.join(__dirname, "public/chat_files")));

// Routes
app.get("/", (req, res) => res.send("API is running"));

app.use(routes);
app.use(express.json());

// middle wares
app.use(errorMiddleware);

// Swagger setup
swaggerDocs(app);

module.exports = app;
