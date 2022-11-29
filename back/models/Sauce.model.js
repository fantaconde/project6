const { Schema, model } = require("mongoose");

const sauceSchema = new Schema(
  {
    sauce: { //sauce Name
      type: String,
      required: true,
    },
    sauceImageUrl: { //Image
      type: String,
      required: true,
    },
    sauceDescription: { //description
      type: String,
    },
    sauceHeat: { //heat
      type: String,
    },
    sauceManufacturer: { //manufacturer
      type: String,
    },
    sauceIngredients: { //Main Pepper Ingredients
      type: String,
    },
  },
  { //When it was created and when it was updated
    timestamps: true,
  }
);

const Sauce = model("Sauce", sauceSchema);
module.exports = Sauce;
