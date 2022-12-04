//define the CRUD  for Sauce Model

const express = require("express");
const router = express.Router();
const Sauce = require("../models/Sauce.model");

//import the multer middleware
const uploadMiddleware = require("../middleware/multer.middleware");

//import the auth middleware
const isAuthorized = require("../middleware/auth.middleware");

//Define the routes

//POST /api/sauces - it creates a new sauce
router.post("/sauces", isAuthorized, uploadMiddleware, (req, res, next) => {
  //get the sauce data from the request body using JSON PARSE
  const sauce = JSON.parse(req.body.sauce);
  
  //get the image from the request file
  const image = req.file;

  //create a new sauce
  const newSauce = {
    sauceName: sauce.name,
    sauceManufacturer: sauce.manufacturer,
    sauceDescription: sauce.description,
    sauceIngredients: sauce.mainPepper,
    sauceHeat: sauce.heat,
  };
  console.log(newSauce);

  Sauce.create({ ...newSauce, sauceImageUrl: image.path })
    .then((createdSauce) => {
      res.status(201).json(createdSauce);
    })
    .catch((err) => next(err));
});

//GET /api/sauces- it gets all the sauces in the database
router.get("/sauces", (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      //get the sauce name, heat level, and image url
      const sauce = sauces.map((sauce) => {
        return {
          name: sauce.sauceName,
          heat: sauce.sauceHeat,
          //modify the file url to include the host
          imageUrl: `${req.protocol}://${req.get("host")}/${sauce.sauceImageUrl}`,
          
        };
      });
      console.log(sauce);
      res.status(200).json(sauce);
    })
    .catch((err) => next(err));
});

//GET /api/sauces/:id - it gets a single sauce by id
router.get("/sauces/:id", (req, res, next) => {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((err) => next(err));
});

module.exports = router;
