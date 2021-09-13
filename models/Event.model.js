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
  user_id: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  location: {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ["Point"], // 'location.type' must be 'Point'
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const Event = model("Event", schema);

module.exports = Event;
