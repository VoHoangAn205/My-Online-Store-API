const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvent");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
require("dotenv").config();
const port = process.env.PORT || 3500;

// midleware for logging
app.use(logger);

//cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
