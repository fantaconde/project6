//Use this import to access to the body json properties in request

const express = require("express");

//Deal with cookie for authentication
const cookieParser = require("cookie-parser");

//Allow connection with the frontend (CORS)
const cors = require("cors");

const FRONTEND_URL =
  "http://localhost:4200" || process.env.ORIGIN || process.env.HOST;

//Middleware configuration

model.exports = (app) => {
  app.set("trust proxy", 1);
  app.use(express.json());
  app.use(cookieParser());
  app.use(
    cors({
      origin: FRONTEND_URL,
      credentials: true,
      Headers: "Content-Type, Authorization",

    })
  );
};
