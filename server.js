require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const { logger } = require("./middleware/logEvent");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const port = process.env.PORT || 3500;
const connectDB = require("./config/dbConn");
const { default: mongoose } = require("mongoose");

// connect to MongoDB
connectDB();

// midleware for logging
app.use(logger);

//cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

app.use("/", require("./routes/root"));

app.use("/products", require("./routes/product"));

app.all(/.*/, (req, res) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ message: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

app.use(errorHandler);

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
});
