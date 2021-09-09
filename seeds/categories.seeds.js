require("../db");
const mongoose = require("mongoose");
const EventType = require("../models/EventType.model");

const categories = [
  { name: "Arts & Culture", description: "Visual, Paintings, Sculptures, Theater, Movies"},
  { name: "Gastronomy", description: "The best culinary experiences"},
  { name: "Kids", description: "Parks, Activities, Entertainment" },
  { name: "Music", description: "Live Music, DJ's, Parties & Concerts" },
  { name: "Sports", description: "All Sports & Outdoor Activities" },
];

EventType.insertMany(categories)
.then((data) => {
    console.log(`inserted ${data.length} categories`)
    return mongoose.connection.close()
})
.catch((err) => {
    console.log(err)
})
