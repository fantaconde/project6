//define the CRUD  for Sauce Model

const express = require("express");
const router = express.Router();
const Sauce = require("../models/Sauce.model");

//import the multer middleware
const uploadMiddleware = require("../middleware/multer.middleware");

//import the auth middleware
// const auth = require("../middleware/auth.middleware");

//Define the routes

//POST route to create a new sauce
//accepting string and image using multer middleware

router.post( "/sauces", uploadMiddleware , (req, res, next) => {
    //get the sauce data from the request body

    console.log(req.body);
    res.json({ message: "Sauce created" });
    // console.log(req.file);

    // const sauce = req.body;
    
    // //get the image from the request file
    // const image = req.file;
    
    // //create a new sauce
    // Sauce.create({ ...sauce, sauceImageUrl: image.path })
    //   .then((createdSauce) => {
    //     res.status(201).json(createdSauce);
    //   })
    //   .catch((err) => next(err));
});

//GET /api/sauces- it gets all the sauces in the database
router.get("/sauces", (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
        res.status(200).json(sauces);
        })
        .catch((err) => next(err));
});



module.exports = router;