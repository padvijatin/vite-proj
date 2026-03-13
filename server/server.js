const express = require("express");
require("dotenv").config();
const cors = require("cors");
const app = express();
const authRouter = require("./router/auth-router");
const serviceRoute = require("./router/service-router");
const adminRoute = require("./router/admin-router");
const connectDb = require("./utils/db");
const errorMiddleware = require("./middlewares/error-middleware");
const contactRouter = require("./router/contact-router");

const allowedOrigins = (process.env.CLIENT_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  origin(origin, callback) {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS error: Origin not allowed"));
  },
};
app.use(cors(corsOptions));
// to get the json data in express app.
app.use(express.json());

// Mount the Router: To use the router in your main Express app, you can "mount" it at a specific URL prefix
app.use("/api/auth", authRouter);
app.use("/api/form", contactRouter);
app.use("/api/data", serviceRoute);

app.use("/api/admin", adminRoute);

app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;
connectDb().then(() => {
  app.listen(PORT, () => {
    console.log(`server is running at port: ${PORT}`);
  });
});
