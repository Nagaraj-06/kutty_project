const express = require("express");
require("./config/env"); // Load .env
const routes = require("../src/routes");
const errorMiddleware = require("./middlewares/error.middleware");
const app = express();
const swaggerDocs = require("./config/swagger");

app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is running"));

app.use(routes);
app.use(express.json());

// middle wares
app.use(errorMiddleware);

// Swagger setup
swaggerDocs(app);

module.exports = app;
