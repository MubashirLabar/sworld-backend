const connection = require("../config/database");

class Search {
  async getPlaces(req, res) {
    const { text } = req.body;

    const query = `SELECT * FROM sw_place WHERE MATCH(name, description) AGAINST('${text}' IN NATURAL LANGUAGE MODE)`;

    connection.query(query, (error, results) => {
      if (error) {
        console.log("fetchPlaces error...", error);
        res.status(500).json({ error: "Something is wrong!" });
      } else {
        return res.status(200).json({
          data: results,
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
