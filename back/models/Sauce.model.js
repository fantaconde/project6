const { Schema, model } = require("mongoose");

const sauceSchema = new Schema(
  {
    sauce: {
      type: String,
      required: true,
    },
    sauceImageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Sauce = model("Sauce", sauceSchema);
module.exports = Sauce;
