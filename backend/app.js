require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectdb } = require("./config/connectdb.js");
const app = express();

// connecting to db
connectdb();

app.use(cors());
app.use(express.json());

// routes
app.use("/api/faqs", require("./routes/faq"));

app.listen(process.env.PORT, () => {
  console.log("server listening on Port", process.env.PORT);
});

module.exports = app;
