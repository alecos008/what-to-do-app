const router = require("express").Router();
const UserModel = require("../models/User.model");
const axios = require("axios");
const bcrypt = require("bcryptjs");

// we need to configure the session :~)

router.get("/signup", (req, res, next) => {
  axios
    .get("https://restcountries.eu/rest/v2/all")
    .then((countries) => {
      res.render("auth/signup.hbs", { countries: countries.data });
    })
    .catch((err) => {
      next(err);
    });
});

router.post("/signup", (req, res, next) => {
  const { name, email, location, password } = req.body;

  //* User must fill all the fields in order to register
  if (!name || !email || !location || !password) {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then((countries) => {
        res.render("auth/signup.hbs", {
          countries: countries.data,
          errorMessage: "Please fill all the fields",
        });
      })
      .catch((err) => {
        next(err);
      });
    return;
  }

  //* Checking email format
  const emailRegex =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(email)) {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then((countries) => {
        res.render("auth/signup.hbs", {
          countries: countries.data,
          errorMessage: "Please enter a valid email",
        });
      })
      .catch((err) => {
        next(err);
      });
    return;
  }

  //* Checking password strength
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;

  if (!passwordRegex.test(password)) {
    axios
      .get("https://restcountries.eu/rest/v2/all")
      .then((countries) => {
        res.render("auth/signup.hbs", {
          countries: countries.data,
          errorMessage:
            "Password not strong enough! You need an uppercase, lowercase, and at least 8 characters",
        });
      })
      .catch((err) => {
        next(err);
      });
    return;
  }
  //* Checking if user exists

  UserModel.findOne({ email })
    .then((user) => {
      if (user) {
        axios
          .get("https://restcountries.eu/rest/v2/all")
          .then((countries) => {
            res.render("auth/signup.hbs", {
              countries: countries.data,
              errorMessage: "Email already taken",
            });
          })
          .catch((err) => {
            next(err);
          });
        return;
      } else {
        //* Encrypting the password
        const salt = bcrypt.genSaltSync(12);
        const encryptedPassword = bcrypt.hashSync(password, salt);

        //* Create the user in the DB
        UserModel.create({
          name,
          email,
          location,
          password: encryptedPassword,
        })
          .then((newUser) => {
            console.log(`Here is your new user ${newUser}`);

            //redirecting to log in page

            res.redirect("/auth/login");
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {});
});

router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs");
});

router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password) {
    res.render("auth/login.hbs", {
      errorMessage: "please fill out all the fields",
    });
    return;
  }
  //* Checking if the user exist in the DB
  UserModel.findOne({ email })
    .then((user) => {
      console.log(user);
      if (user) {
        //* Once we find it, we need to check if the password matches
        const passwordCheck = bcrypt.compareSync(password, user.password);
        //* If they do, Authenticate the user
        console.log(passwordCheck);

        //* Redirect the user to private route
        if (passwordCheck) {
          //*  If they do, Authenticate the user.Creating an active session
          req.session.loggedInUser = user;

          //* Creating global variables in HBS to help with auth
          req.app.locals.isLoggedIn = true;

          //*  redirect the user to private route like '/profile'
          res.redirect("/profile");
        } else {
          res.render("auth/login.hbs", {
            errorMessage: "wrong password, try again",
          });
        }
      } else {
        res.render("auth/login.hbs", {
          errorMessage: "user doesn't exist, please signup",
        });
      }
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
