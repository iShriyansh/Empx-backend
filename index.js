const express = require("express");
const bodyParser = require("body-parser");
const InitiateMongoServer = require("./config/db");
const user = require("./routes/user");
const employee = require("./routes/employee");
let cors = require("cors");

InitiateMongoServer();
const app = express();

// PORT
const PORT = process.env.PORT || 4000;

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.get("/", (req, res) => {
  res.json({ message: "API Working" });
});


app.use("/user", user);
app.use("/employee", employee);


app.listen(PORT, (req, res) => {
  console.log(`Server Started at PORT ${PORT}`);
});
