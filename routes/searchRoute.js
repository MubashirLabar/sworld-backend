const express = require("express");
const Search = require("../controllers/searchController");
const router = express.Router();

router.post("/search", Search.getPlaces);

module.exports = router;
