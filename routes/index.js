const router = require("express").Router();
const axios = require("axios").default;

/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
