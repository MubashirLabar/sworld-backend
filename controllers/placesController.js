const connection = require("../config/database");

class Places {
  /* This function are defined only for testing purpose */
  async getPlaces(req, res) {
    const query = `SELECT * FROM sw_place LIMIT 300`;

    connection.query(query, function (error, results, fields) {
      if (error) {
        console.log("fetchPlaces error...", error);
        return res.status(500).json("Something is wrong!");
      } else {
        console.log("results....", results[0].embed);

        return res.status(200).json({
          data: results,
        });
      }
    });
  }

  /* This function are defined only for testing purpose */
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

  async getPlaceDetail(req, res) {
    const { id } = req.body;

    const swPlaceQuery = `
      SELECT p.*, a.lat, a.lon, a.zip_code, a.address, placeType.name AS type, GROUP_CONCAT(m.file_path, m.file_name, ".", m.file_extension) AS images, user.first_name, user.last_name, user.nickname, user.email_uid, user.is_seller, user.company_name, user.social
      FROM sw_place AS p
      JOIN sw_address AS a ON p.oid_address = a.oid
      JOIN sw_place_type AS placeType ON p.oid_place_type = placeType.oid

      JOIN sw_place_media AS pm ON p.oid = pm.oid_place
      JOIN sw_media AS m ON pm.oid_media = m.oid

      JOIN sw_user_place AS userPlace ON p.oid = userPlace.oid_place
      JOIN sw_user AS user ON userPlace.oid_user = user.oid
      
      WHERE p.oid = ${id}
      GROUP BY p.oid
  `;

    connection.query(swPlaceQuery, (error, results) => {
      if (error) {
        console.log("fetchPlaces error...", error);
        res.status(500).json({ error: "Something is wrong!" });
      } else {
        // Convert images to an array
        const modifiedResults = results.map((result) => {
          const images = result.images.split(",");
          return { ...result, images };
        });

        return res.status(200).json({
          data: modifiedResults[0],
        });
      }
    });
  }
}

module.exports = new Places();
