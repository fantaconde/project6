const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String, //define the type of the field
      required: true, //it is required
      unique: true, //it must the only one (not duplicated)
      lowercase: true, //FantaconDE@289@gmail.com == FANTACONDE289@GMAIL.COM == fantaconde289@gmail.com
    },
    hashPassword: {
      type: String,
      required: true, //it is required
    },
  },
  {
    timestamps: true,
  }
);


//export the model to allow access with other files and modules ie routes.
const User = model("User", userSchema);
module.exports = User;