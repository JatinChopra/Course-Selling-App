const express = require("express");
const app = express();
const morgan = require("morgan");
const PORT = 5000;
require("dotenv").config();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(morgan("dev"));
app.use(cors());

// Establish connection to mango db instance
const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);

    if (mongoose.connection.readyState === 1) {
      console.log("Connected to DB");
    }

    // start the server only if the connection to db was successfull
    app.listen(PORT, () => {
      console.log(`Started listening on port ${PORT}`);
    });
  } catch (e) {
    console.log("Error in connecting to DB : ", e.message);
  }
};

connectToDB();

// import routes
const authentication = require("./src/routes/authentication");
const course = require("./src/routes/course");
const managecourse = require("./src/routes/managecourse");
const upload = require("./src/routes/upload");
const mylearning = require("./src/routes/mylearning");

// Register middleware
app.use(morgan("dev")); // logging middleware
app.use(express.json()); // json parsing

// Routes
app.use("/api/auth", authentication);
app.use("/api", course);
app.use("/api", managecourse);
app.use("/api", upload);
app.use("/api", mylearning);
