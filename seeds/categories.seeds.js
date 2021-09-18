require("dotenv/config");
require("../db");
const mongoose = require("mongoose");
const EventType = require("../models/EventType.model");

const categories = [
  {
    name: "Arts & Culture",
    description: "Visual, Paintings, Sculptures, Theater, Movies",
    imageUrl:
      "https://res.cloudinary.com/alecos008/image/upload/v1631459459/s1xmzlxv1zv6nb2lxffi.jpg",
  },
  {
    name: "Gastronomy",
    description: "The best culinary experiences",
    imageUrl:
      "https://res.cloudinary.com/alecos008/image/upload/v1631459553/wobp2kw8uzx3e55aqu0x.jpg",
  },
  {
    name: "Kids",
    description: "Parks, Activities, Entertainment",
    imageUrl:
      "https://res.cloudinary.com/alecos008/image/upload/v1631459619/syzol2kwvgwchtjewjqw.jpg",
  },
  {
    name: "Music",
    description: "Live Music, DJ's, Parties & Concerts",
    imageUrl:
      "https://res.cloudinary.com/alecos008/image/upload/v1631459693/bihdkfst72uqdslruwod.jpg",
  },
  {
    name: "Sports",
    description: "All Sports & Outdoor Activities",
    imageUrl:
      "https://res.cloudinary.com/alecos008/image/upload/v1631459751/jegbgkulktqctvrizbkp.jpg",
  },
];

EventType.insertMany(categories)
  .then((data) => {
    console.log(`inserted ${data.length} categories`);
    return mongoose.connection.close();
  })
  .catch((err) => {
    console.log(err);
  });
