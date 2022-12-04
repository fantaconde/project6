const express = require("express");

// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");

const router = express.Router();

//Require the User model in order to interact with the database
const User = require("../models/User.model");

// Handles password encryption
const jwt = require("jsonwebtoken");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

//Post api/auth/signup

router.post("/signup", (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password are provided
  if (!email) {
    res.status(400).json({ message: "Provide email" });
    return;
  }

  if (!password) {
    res.status(400).json({ message: "Provide password" });
    return;
  }

  //Check if user exists in the database
  User.findOne({ email })
    //resonse is the user that was found
    //ideal case foundUser == null
    .then((foundUser) => {
      if (foundUser) {
        res.status(400).json({ message: "The email already exists" });
        return;
      }

      //encypt the password
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPassword = bcrypt.hashSync(password, salt);

      //Create a new user if it doesn't exist in the database
      return User.create({ email, hashPassword });
    })
    .then((createdUser) => {
      //Send the user's information to the frontend

      // console.log(createdUser)
      const { _id, email } = createdUser;

      //create new user in the session
      const user = { _id, email };

      //send the json response to the frontend
      res.status(201).json({ user: user });
    })
    .catch((err) => next(err));
});

//POST /api/auth/login
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password are provided
  if (!email) {
    res.status(400).json({ message: "Provide email and password" });
    return;
  }

  if (!password) {
    res.status(400).json({ message: "Provide password" });
    return;
  }
  //Check if user exists in the database
  User.findOne({ email })
    .then((foundUser) => {
      if (!foundUser) {
        res
          .status(400)
          .json({ message: "The email doesn't exist Please SignUp" });
        return;
      }

      //Check if the password is correct
      if (bcrypt.compareSync(password, foundUser.hashPassword)) {
        //if the password is correct create a user object without the password
        const { _id, email } = foundUser;
        // const user = { _id, email };

        //create an object that will be set as a token  payload
        const payload = { _id, email };

        //Create a JSON Web Token and sign it

        const token = jwt.sign(payload, process.env.SECRET, {
          algorithm: "HS256",
          expiresIn: "1h",
        });

        // console.log(token);

        res.status(200).json({ token: token, userId: payload });
      } else {
        res.status(400).json({ message: "Incorrect password" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
