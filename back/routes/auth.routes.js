const express = require("express");
const router = express.Router();

//Require the User model in order to interact with the database
const User = require("../models/User.model");

//Post api/auth/signup

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password are provided
  if (!email || !password) {
    res.status(400).json({ message: "Provide email and password" });
    return;
  }

  //Check if user exists in the database
  User.findOne({ email })
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "The email already exists" });
        return;
      }

      //Create a new user if it doesn't exist in the database
      return User.create({ email, password });
    })
    .then((createdUser) => {
      //Send the user's information to the frontend
      const { _id, email } = createdUser;

      //create new user in the session
      const user = { _id, email };

      //send the json response to the frontend
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err));
});

module.exports = router;
