require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use(express.urlencoded({ extended: true }));


const db = process.env.MONGODB_URI;
const port = process.env.PORT || 8889;


const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');

app.use('/api/user', userRoutes);
app.use('/api/admin', adminRoutes);

const connectWithRetry = () => {
  console.log("Attempting MongoDB connection...");

  mongoose
    .set("strictQuery", true)
    .connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("MongoDB successfully connected");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      console.log("Retrying in 5 seconds...");
      setTimeout(connectWithRetry, 5000);
    });
};

connectWithRetry();

app.listen(port, () => console.log(`Server up and running on port ${port} !`));



