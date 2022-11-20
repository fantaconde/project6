const { Schema, model } = require("mongoose");

const saucerSchema = new Schema(
  {
    saucer: {
      type: String,
      required: true,
    },
    saucerImage: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Saucer = model("Saucer", saucerSchema);
module.exports = Saucer;
