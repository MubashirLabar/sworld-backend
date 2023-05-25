require("dotenv").config();
const express = require("express");

const cors = require("cors");
const app = express();

const chatRoutes = require("./routes/chatRoutes");
const placesRoutes = require("./routes/placesRoutes");
const searchRoute = require("./routes/searchRoute");

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome on world App!",
  });
});

// user routes
app.use("/api", chatRoutes);
app.use("/api", placesRoutes);
app.use("/api", searchRoute);

const port = process.env.PORT;

app.listen(port, () => {
  console.log("server is running on at port number : ", port);
});
