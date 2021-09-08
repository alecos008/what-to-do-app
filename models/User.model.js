const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const UserSchema = new Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  location: String,
  password: String,
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
