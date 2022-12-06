//define the CRUD  for Sauce Model

const express = require("express");
const router = express.Router();
const Sauce = require("../models/Sauce.model");

//import the multer middleware
const uploadMiddleware = require("../middleware/multer.middleware");

//import the auth middleware
const isAuthorized = require("../middleware/auth.middleware");

//allow user to delete files/images
const fs = require("fs");

//Define the routes

//POST /api/sauces - it creates a new sauce
router.post("/sauces", isAuthorized, uploadMiddleware, (req, res, next) => {
  //get the sauce data from the request body using JSON PARSE convert to JSON Format
  const sauce = JSON.parse(req.body.sauce);
  //get the image from the request file
  const image = req.file;

  //create a new sauce
  const newSauce = {
    userId: sauce.userId._id,
    name: sauce.name,
    manufacturer: sauce.manufacturer,
    description: sauce.description,
    mainPepper: sauce.mainPepper,
    heat: sauce.heat,
    imageUrl: image.path,
    userId: req.Auth.userId,
  };
//Call Mongoose Model to save the new sauce
  Sauce.create({ ...newSauce })
    .then((createdSauce) => {
      res.status(201).json(createdSauce);
    })
    .catch((err) => next(err));
});

//GET /api/sauces- it gets all the sauces in the database
router.get("/sauces", isAuthorized, (req, res, next) => {
  Sauce.find()
    .then((sauce) => {
      // console.log(sauce);
      sauce.forEach((sauce) => {
        //modify the sauce ImageUrl
        sauce.imageUrl = `${req.protocol}://${req.get("host")}/${
          sauce.imageUrl
        }`;
      });
      res.status(200).json(sauce);
    })
    .catch((err) => next(err));
});

//GET /api/sauces/:id - it gets a single sauce by id
router.get("/sauces/:id", isAuthorized, (req, res, next) => {
  Sauce.findById(req.params.id)
    .then((sauce) => {
      //modify the sauce imageUrl
      sauce.imageUrl = `${req.protocol}://${req.get("host")}/${sauce.imageUrl}`;
      res.status(200).json(sauce);
    })
    .catch((err) => next(err));
});

//PUT /api/sauces/:id - it updates a single sauce by id
router.put("/sauces/:id", isAuthorized, uploadMiddleware, (req, res, next) => {
  //find the object to find the user ID

  Sauce.findById(req.params.id)
    .then((sauces) => {
      userId = sauces.userId;

      let sauce;
      let image;

      //confirm the user is authorized
      if (req.Auth.userId !== userId) {
        return res.status(401).json({ message: "Unauthorized" });
      } else {
        //check if type of req.body.sauce is string to determine if the user is updating the image
        if (typeof req.body.sauce === "string") {
          //get the previous sauce

          //if it is a string, parse it
          sauce = JSON.parse(req.body.sauce);
          //get the image from the request file
          image = req.file;
          sauce.imageUrl = image.path;

          //Find the existing image and delete it
          Sauce.findById(req.params.id)
            .then((sauce) => {
              //delete the previous image
              fs.unlinkSync(sauce.imageUrl);
            })
            .catch((err) => next(err));

          //update the sauce
          Sauce.findByIdAndUpdate(req.params.id, { ...sauce })
            .then((updatedSauce) => {
              return res.status(200).json(updatedSauce);
            })
            .catch((err) => next(err));
        } else {
          //if it is not a string, then it is an object 
          sauce = req.body;
          //update the sauce
          Sauce.findByIdAndUpdate(req.params.id, { ...sauce })
            .then((updatedSauce) => {
              return res.status(200).json(updatedSauce);
            })
            .catch((err) => next(err));
        }
      }
    })
    .catch((err) => next(err));
});

//DELETE /api/sauces/:id - it deletes a single sauce by id
router.delete("/sauces/:id", isAuthorized, (req, res, next) => {
  //get the user from sauce in the database
  var userId;
  Sauce.findById(req.params.id)
    .then((sauce) => {
      userId = sauce.userId;
      //confirm the user is authorized
      if (req.Auth.userId !== userId) {
        res.status(401).json({ message: "Unauthorized" });
        // console.log("Unauthorized");
      } else {
        Sauce.findByIdAndDelete(req.params.id)
          .then((deletedSauce) => {
            //delete the image file from  the server
            // console.log(deletedSauce);
            fs.unlinkSync(deletedSauce.imageUrl);
            return res.status(200).json(deletedSauce);
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
});

//The following links will allow the user to like or dislike a sauce
//It will allow to add like and dislike Counter

///POST /api/sauces/:id/like

router.post("/sauces/:id/like", isAuthorized, (req, res, next) => {
  const like = req.body.like;
  const userId = req.Auth.userId;
  const sauceId = req.params.id;

  //check if the user has liked the sauce
  // console.log(like);

  if (like === 1) {
    //check if the user has liked the sauce
    Sauce.findById(sauceId)
      .then((sauce) => {
        //check if the user has liked the sauce
        if (sauce.usersLiked.includes(userId)) {
          return res
            .status(200)
            .json({ message: "You have already liked this" });
        //check if the user has disliked the sauce
        } else if (sauce.usersDisliked.includes(userId)) {
          //remove the user from the usersDisliked array
          sauce.usersDisliked = sauce.usersDisliked.filter(
            (user) => user !== userId
          );
          //remove the user from the usersLiked array
          sauce.usersLiked.push(userId);
          //decrement the dislike counter
          sauce.dislikes--;
          //increment the like counter
          sauce.likes++;
          //update the sauce
          Sauce.findByIdAndUpdate(sauceId, sauce)
            .then((updatedSauce) => {
              return res.status(200).json(updatedSauce);
            })
            .catch((err) => next(err));
        } else {
          //add the user to the usersLiked array
          sauce.usersLiked.push(userId);
          //increment the likes counter
          sauce.likes++;
          //update the sauce
          Sauce.findByIdAndUpdate(sauceId, sauce)
            .then((updatedSauce) => {
              return res.status(200).json(updatedSauce);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  }
  //else if the user has disliked the sauce
  else if (like === -1) {
    //check if the user has disliked the sauce
    Sauce.findById(sauceId)
      .then((sauce) => {
        //check if the user has disliked the sauce
        if (sauce.usersDisliked.includes(userId)) {
          return res
            .status(200)
            .json({ message: "You have already disliked this" });
        //check if the user has liked the sauce
        } else if (sauce.usersLiked.includes(userId)) {
          //remove the user from the usersLiked array
          sauce.usersLiked = sauce.usersLiked.filter((user) => user !== userId);
          //add the user to the usersDisliked array
          sauce.usersDisliked.push(userId);
          //decrement the like counter
          sauce.likes--;
          //increment the dislike counter
          sauce.dislikes++;
          //update the sauce
          Sauce.findByIdAndUpdate(sauceId, sauce)
            .then((updatedSauce) => {
              return res.status(200).json(updatedSauce);
            })
            .catch((err) => next(err));
        } else {
          //add the user to the usersDisliked array
          sauce.usersDisliked.push(userId);
          //increment the dislikes counter
          sauce.dislikes++;
          //update the sauce
          Sauce.findByIdAndUpdate(sauceId, sauce)
            .then((updatedSauce) => {
              return res.status(200).json(updatedSauce);
            })
            .catch((err) => next(err));
        }
      })
      .catch((err) => next(err));
  }
  //else if the user has removed the like or dislike
  else if (like === 0) {
    //find it a like a dislike
    Sauce.findById(sauceId)
      .then((sauce) => {
        //check for user in like Array
        if (sauce.usersLiked.includes(userId)) {
          //remove the user from the array
          sauce.usersLiked.splice(sauce.usersLiked.indexOf(userId), 1);
          //decrement the likes counter
          sauce.likes--;
          //update the sauce
          Sauce.findByIdAndUpdate(sauceId, sauce)
            .then((updatedSauce) => {
              return res.status(200).json(updatedSauce);
            })
            .catch((err) => next(err));
        }
        else if(sauce.usersDisliked.includes(userId))
        {
          //remove the user from the array
          sauce.usersDisliked.splice(sauce.usersDisliked.indexOf(userId), 1);
          //decrement the dislike counter
          sauce.dislikes--;
          //update the sauce
          Sauce.findByIdAndUpdate(sauceId, sauce)
            .then((updatedSauce) => {
              return res.status(200).json(updatedSauce);
            })
            .catch((err) => next(err));
        }
        else{
          return res.status(401).json({ message: "No like or dislikes" });
        }
      })
      .catch((err) => next(err));
  }
  else{
    return res.status(401).json({ message: "No Like or dislike" });
  }
});

module.exports = router;
