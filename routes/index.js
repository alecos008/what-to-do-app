const router = require("express").Router();
const axios = require("axios").default;

/* GET home page */
router.get("/", (req, res, next) => {
  axios
    .get(`https://restcountries.eu/rest/v2/all`)
    .then((countries) => {
      console.log(countries.data);
      res.render("index", { countries: countries.data });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
