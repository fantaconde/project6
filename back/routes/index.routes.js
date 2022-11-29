//import express and router
//router is a library that allows us to create routes
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.json('Api Success');
});

module.exports = router;