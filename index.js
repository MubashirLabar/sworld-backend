const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();

const chatRoutes = require("./routes/chatRoutes");
const placesRoutes = require("./routes/placesRoutes");

app.use(cors());

// Create a middleware to parse JSON request bodies
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome on world App!",
  });
});

// user routes
app.use("/api", chatRoutes);
app.use("/api", placesRoutes);

const port = 5000;

app.listen(port, () => {
  console.log("server is running on at port number : ", port);
});
