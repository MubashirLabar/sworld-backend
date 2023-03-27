const express = require("express");
const cors = require("cors");

const app = express();

const chatRoutes = require("./routes/chatRoutes");

app.use(cors());

// add middleware
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    msg: "Welcome on world App!",
  });
});

// user routes
app.use("/api", chatRoutes);

const port = 5000;

app.listen(port, () => {
  console.log("server is running on at port number : ", port);
});
