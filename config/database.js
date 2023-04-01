const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "141.94.29.221",
  user: "sworld_demo",
  password: "gig&6U715",
  database: "sworld_demo",
});

connection.connect((err) => {
  err && console.log("Error in database connection:", err);
});

module.exports = connection;
