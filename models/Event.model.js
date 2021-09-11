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
    type: Date,
    required: true,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: "EventType",
    required: true,
  },
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
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

const Event = model("Event", schema);

module.exports = Event;
