require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cookieParser = require("cookie-parser");
const { logger } = require("./middleware/logEvent");
const errorHandler = require("./middleware/errorHandler");
const cors = require("cors");
const corsOptions = require("./config/corsOptions");
const port = process.env.PORT || 3500;
const connectDB = require("./config/dbConn");
const { default: mongoose } = require("mongoose");
const verifyJWT = require("./middleware/verifyJWT");
const credentials = require("./middleware/credentials");

// connect to MongoDB
connectDB();

// midleware for logging
app.use(logger);

app.use(credentials);

//cross origin resource sharing
app.use(cors(corsOptions));

// built-in middleware for json
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// built-in middleware for json
app.use(express.json());

app.use("/", require("./routes/root"));

app.use("/register", require("./routes/register"));
app.use("/auth", require("./routes/auth"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use(verifyJWT);
app.use("/products", require("./routes/api/product"));

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
