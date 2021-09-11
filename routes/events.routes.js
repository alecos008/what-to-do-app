const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth-middlewares");
const axios = require("axios");
const UserModel = require("../models/User.model");
const EventType = require("../models/EventType.model");
const Event = require("../models/Event.model");

router.get("/categories", (req, res, next) => {
  EventType.find()
    .then((eventCategories) => {
      res.render("events/categories", { eventCategories });
    })
    .catch((err) => next(err));
});

router.get("/create", isLoggedIn, (req, res, next) => {
  axios
    .get("https://restcountries.eu/rest/v2/all")
    .then((countries) => {
      res.render("events/create-event.hbs", {
        countries: countries.data,
      });
    })
    .catch((err) => {
      next(err);
    });
  return;
});

router.post("/create", isLoggedIn, (req, res, next) => {
  const { name, description, date, location } = req.body;
  const { _id: user_id = "" } = req.session.user;
  const coordinates = req.body.location
    .split(",")
    .map((str) => Number(str))
    .reverse();
  console.log("These are the coordinates:", coordinates);

  //* User must fill all the fields in order to create the event
  if (!name || !description || !date || !location || !user_id) {
    res.redirect("/events/create");
  } else {
    Event.create({
      user_id,
      name,
      description,
      date,
      location: {
        coordinates,
        type: "Point",
      },
    })
      .then((event) => {
        console.log(`Here is the event ${event}`);

        //redirecting to log in page

        res.redirect("/events/categories");
      })
      .catch((err) => {
        next(err);
      });
  }
});
// For event details
router.get("/categories/:categoryId", (req, res, next) => {
  const { categoryId } = req.params;
  EventType.findById(categoryId)
    .then((eventType) => {
      Event.find()
        .then((eventList) => {
          res.render("events/category-events.hbs", { eventType, eventList });
        })
        .catch((err) => {
          next(err);
        });
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  Event.findById(id)
    .then((event) => {
      res.render("events/details.hbs/", { event });
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
