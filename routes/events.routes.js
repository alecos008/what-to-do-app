const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth-middlewares");
const axios = require("axios");
const UserModel = require("../models/User.model");
const EventType = require("../models/EventType.model");
const Event = require("../models/Event.model");
const fileUploader = require("../middlewares/cloudinary.config");

router.get("/create", isLoggedIn, (req, res, next) => {
  axios
    .get("https://restcountries.eu/rest/v2/all")
    .then((countries) => {
      EventType.find().then((eventCategories) => {
        res.render("events/create-event.hbs", {
          countries: countries.data,
          eventCategories,
        });
      });
    })
    .catch((err) => next(err))
    .catch((err) => {
      next(err);
    });
  return;
});

router.post(
  "/create",
  fileUploader.single("imageUrl"),
  isLoggedIn,
  (req, res, next) => {
    const { name, description, date, type, location } = req.body;
    const { _id: user_id = "" } = req.session.user;
    const coordinates = req.body.location
      .split(",")
      .map((str) => Number(str))
      .reverse();

    //! let imageUrl = req.file.path; => RETURNS CAN NOT READ PROPERTY OF UNDEFINED
    //console.log("req . file =", req);
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    }
    console.log("Image url", imageUrl); //* Here we have an error type and imageUrl is undefined

    //* User must fill all the fields in order to create the event
    if (!name || !description || !date || !location || !user_id || !imageUrl) {
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
        imageUrl,
        type,
      })
        .then((event) => {
          console.log(`Here is the event ${event}`);

          //redirecting to log in page

          res.redirect("/");
        })
        .catch((err) => {
          next(err);
        });
    }
  }
);
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

// COUNTER FOR PEOPLE ATTENDING

const myButton = document.getElementById("isAttending");
const myOutput = document.getElementById("myOutput");

let counter = 0;

function addToNumber() {
  myOutput.innerHTML = `${1 + counter++}`;
}
myButton.onclick = addToNumber;
