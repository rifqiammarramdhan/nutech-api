require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3004;
const routes = require("./src/routes");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// Routes
app.use(routes);

// Middleware For Error Handling
app.use((err, req, res, next) => {
  // Cek Log
  console.log(err);
  res.status(400).json({
    error: "error",
    message: err,
  });
});

app.listen(PORT, () => {
  console.log(`Server Listening on Port: ${PORT}`);
});
