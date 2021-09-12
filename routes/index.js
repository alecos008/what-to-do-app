const router = require("express").Router();
const axios = require("axios").default;
const EventType = require("../models/EventType.model");
const fileUploader = require("../middlewares/cloudinary.config");

/* GET home page */
router.get("/", (req, res, next) => {
  EventType.find()
    .then((categories) => {
      res.render("index", { categories });
    })
    .catch((err) => next(err));
});

router.post("/", fileUploader.single("imageUrl"), (req, res, next) => {
  const { name, description } = req.body;

  let imageUrl;

  if (req.file) {
    imageUrl = req.file.path;
  }

  EventType.create({ name, description, imageUrl })
    .then((category) => {
      console.log("here is your category", category);
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
