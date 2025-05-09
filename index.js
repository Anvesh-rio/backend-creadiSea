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

mongoose
  .set("strictQuery", true)
  .connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB successfully connected"))
  .catch((err) => console.log("Error connecting to MongoDB", err));


app.listen(port, () => console.log(`Server up and running on port ${port} !`));



