const connection = require("../config/database");

class Search {
  async getPlaces(req, res) {
    let searchedRecords = [];
    const { text } = req.body;

    // const swPlaceQuery = `SELECT * FROM sw_place WHERE MATCH(name, description) AGAINST('${text}' IN NATURAL LANGUAGE MODE)`;
    // const swPhotoAlbumQuery = `SELECT * FROM sw_photo_album WHERE MATCH(name) AGAINST('${text}' IN NATURAL LANGUAGE MODE)`;
    // const swItineraryQuery = `SELECT * FROM sw_itinerary WHERE MATCH(name, description) AGAINST('${text}' IN NATURAL LANGUAGE MODE)`;

    const swPlaceQuery = `
      SELECT p.*, a.lat, a.lon, a.zip_code, a.address, GROUP_CONCAT(m.file_path, m.file_name) AS images, user.first_name, user.last_name, user.nickname, user.email_uid, user.is_seller, user.company_name, user.social 
      FROM sw_place AS p
      JOIN sw_address AS a ON p.oid_address = a.oid

      JOIN sw_place_media AS pm ON p.oid = pm.oid_place
      JOIN sw_media AS m ON pm.oid_media = m.oid

      JOIN sw_user_place AS userPlace ON p.oid = userPlace.oid_place
      JOIN sw_user AS user ON userPlace.oid_user = user.oid
      
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
          data: modifiedResults,
        });
      }
    });
  }
  catch(e) {
    console.log("catch error...", e.message);
    res.status(500).json({ error: "Something is wrong!" });
  }
}

module.exports = new Search();
