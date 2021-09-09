const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth-middlewares");
const UserModel = require("../models/User.model");
const EventType = require("../models/EventType.model");

router.get("/categories", (req, res, next) => {
  EventType.find()
    .then((eventCategories) => {
      res.render("events/categories", { eventCategories });
    })
    .catch((err) => next(err));
});

router.get("/:id", (req, res, next) => {
  res.render("events/categories/");
});

router.get("/categories/:categoryName", (req, res, next) => {
  res.render("events/categories/");
});

module.exports = router;
