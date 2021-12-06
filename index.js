const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/users");
const authRoute = require("./routes/auth");
const authorRoute = require("./routes/author");
const logger = require("./logger");

dotenv.config();

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    logger.info("DB connection successfull");
  })
  .catch((error) => console.log(error));

app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/author", authorRoute);

app.listen(process.env.PORT || 3000, () => {
  logger.info("Backend Server is running!");
});
