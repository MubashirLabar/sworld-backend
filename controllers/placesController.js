const connection = require("../config/database");

class Places {
  async getPlaces(req, res) {
    const query = `SELECT * FROM sw_place LIMIT 1`;

    connection.query(query, function (error, results, fields) {
      if (error) {
        console.log("fetchPlaces error...", error);
        return res.status(500).json("Something is wrong!");
      } else {
        return res.status(200).json({
          data: results,
        });
      }
    });
  }

  async updatePlace(req, res) {
    const { id, keywords } = req.body;

    const query = `  
      UPDATE sw_place
      SET keywords=${keywords}
      WHERE oid = ${id}
    `;

    connection.query(query, [id], function (error, results, fields) {
      if (error) {
        console.log("updatePlace error...", error);
        return res.status(500).json("Something went wrong!");
      } else {
        return res.status(200).json({
          msg: "Record updated successfully!",
        });
      }
    });
  }
}

module.exports = new Places();
