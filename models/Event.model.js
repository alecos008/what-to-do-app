const { Schema, model } = require("mongoose");
const EventTypeModel = require("./EventType.model");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: date,
    required: true,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: "EventType",
    required: true,
  },
  location: {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [Number, Number],
    },
    properties: {
      name: String,
    },
  },
});

module.exports = model("Event", schema);
