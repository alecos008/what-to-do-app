const router = require("express").Router();
const { isLoggedIn } = require("../middlewares/auth-middlewares");
const axios = require("axios");
const UserModel = require("../models/User.model");
const EventType = require("../models/EventType.model");
const Event = require("../models/Event.model");
const fileUploader = require("../middlewares/cloudinary.config");

router.get("/create", isLoggedIn, (req, res, next) => {
  axios
    .get("https://restcountries.com/v3/all")
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
    const { name, description, date, type, latitude, longitude, location } =
      req.body;
    const { _id: user_id = "" } = req.session.user;
    let coordinates;
    if (!longitude && !latitude) {
      coordinates = location
        .split(",")
        .map((str) => Number(str))
        .reverse();
    } else {
      coordinates = [latitude, longitude];
    }

    //! let imageUrl = req.file.path; => RETURNS CAN NOT READ PROPERTY OF UNDEFINED
    console.log(coordinates);
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    }
    console.log("Image url", imageUrl, "type:", type); //* Here we have an error type and imageUrl is undefined

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
  Event.find({ type: categoryId })
    .then((events) => {
      res.render("events/near-you.hbs", {
        events: JSON.stringify(events),
        eventsHbs: events,
      });
      console.log(events);
    })
    .catch((err) => next(err));
});

router.get("/near-you", (req, res, next) => {
  Event.find()
    .then((events) => {
      res.render("events/near-you", {
        events: JSON.stringify(events),
        eventsHbs: events,
      });
    })
    .catch((err) => next(err));
});

router.get("/:id", (req, res, next) => {
  const { id } = req.params;
  let loggedInUserId;
  if (req.session.user) {
    loggedInUserId = req.session.user._id;
  }
  Event.findById(id)
    .then((event) => {
      let itsTheOwner = false;
      if (loggedInUserId) {
        itsTheOwner = event.user_id.toString() === loggedInUserId.toString();
      }
      res.render("events/details.hbs", {
        event,
        itsTheOwner,
        events: JSON.stringify([event]),
      });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/:id/attendance/increase", isLoggedIn, (req, res, next) => {
  const { id } = req.params;
  Event.findByIdAndUpdate(id, { $inc: { attendance: 1 } }, { new: true })
    .then((updated) => {
      //console.log(updated);
      res.redirect(`/events/${id}`);
    })
    .catch((err) => {
      next(err);
    });
});

router.get("/:id/edit", isLoggedIn, (req, res, next) => {
  Event.findById(req.params.id)
    .then((event) => {
      res.render("events/edit", { event });
    })
    .catch((err) => {
      next(err);
    });
});

router.post(
  "/:id/edit",
  isLoggedIn,
  fileUploader.single("imageUrl"),
  (req, res, next) => {
    let imageUrl;
    if (req.file) {
      imageUrl = req.file.path;
    }
    Event.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        imageUrl,
        location: { coordinates: [req.body.latitude, req.body.longitude] },
      },
      { new: true }
    )
      .then((event) => {
        res.redirect(`/events/${event._id}`);
      })
      .catch((err) => {
        next(err);
      });
  }
);

router.post("/:id/delete", isLoggedIn, (req, res, next) => {
  Event.findByIdAndDelete(req.params.id)
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      console.log("error deleting the event", err);
    });
});

module.exports = router;
