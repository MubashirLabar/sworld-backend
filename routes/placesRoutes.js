const express = require("express");
const Places = require("../controllers/placesController");
const router = express.Router();

router.get("/getPlaces", Places.getPlaces);
router.put("/updatePlace", Places.updatePlace);
router.post("/placeDetail", Places.getPlaceDetail);

module.exports = router;
