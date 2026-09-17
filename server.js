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
const createRateLimiter = require("./middleware/createRateLimiter");
const productRoute = require("./routes/api/product");
const registerRoute = require("./routes/register");
const OtpRoute = require("./routes/otp");
const refreshRoute = require("./routes/refresh");
const logoutRoute = require("./routes/logout");
const categoryRoute = require("./routes/api/category");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/api/user");
const cartRoute = require("./routes/api/cart");
const orderRoute = require("./routes/api/order");
const uploadRoute = require("./routes/api/upload");
const galleryRoute = require("./routes/api/gallery");

const globalApiLimiter = createRateLimiter({
  windowSeconds: 15 * 60,
  maxRequests: 100,
  keyPrefix: "global",
});

const authApiLimiter = createRateLimiter({
  windowSeconds: 15 * 60,
  maxRequests: 15,
  keyPrefix: "auth_strict",
});

// connect to MongoDB
connectDB();

app.set("trust proxy", 1);

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

app.use("/register", authApiLimiter, registerRoute);
app.use("/requestOtp", authApiLimiter, OtpRoute);
app.use("/auth", authRoute);
app.use("/refresh", authApiLimiter, refreshRoute);
app.use("/logout", authApiLimiter, logoutRoute);
app.use("/category", globalApiLimiter, categoryRoute);
app.use("/product", globalApiLimiter, productRoute);
app.use(verifyJWT);
app.use("/user", authApiLimiter, userRoute);
app.use("/cart", globalApiLimiter, cartRoute);
app.use("/order", globalApiLimiter, orderRoute);
app.use("/upload", globalApiLimiter, uploadRoute);
app.use("/gallery", globalApiLimiter, galleryRoute);

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

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR CATCHED:", err.message);
  res.status(500).json({ error: err.message });
});

mongoose.connection.once("open", () => {
  console.log("connected to mongoDB");
  app.listen(port, () => {
    console.log(`server running on port ${port}`);
  });
});
