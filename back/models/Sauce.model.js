const { Schema, model } = require("mongoose");

const sauceSchema = new Schema(
  {
    userId: {
      //user id
      type: String,
    },
    name: {
      //sauce Name
      type: String,
      required: true,
    },
    manufacturer: {
      //manufacturer
      type: String,
    },
    description: {
      //description
      type: String,
    },
    mainPepper: {
      //Main Pepper Ingredients
      type: String,
    },
    imageUrl: {
      //Image
      type: String,
      required: true,
    },
    heat: {
      //heat
      type: String,
    },
    likes: {
      //likes
      type: Number,
      default: 0,
    },

    dislikes: {
      //dislikes
      type: Number,
      default: 0,
    },
    usersLiked: {
      //users who liked
      type: [String],
    },
    usersDisliked: {
      //users who disliked
      type: [String],
    },
  },
  {
    //When it was created and when it was updated
    timestamps: true,
  }
);

const Sauce = model("Sauce", sauceSchema);
module.exports = Sauce;
