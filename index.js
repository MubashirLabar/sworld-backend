require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(express.json());

const chatRoutes = require("./routes/chatRoutes");
const placesRoutes = require("./routes/placesRoutes");

app.use(cors());

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome on world App!",
  });
});

// user routes
app.use("/api", chatRoutes);
app.use("/api", placesRoutes);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("server is running on at port number : ", port);
});
