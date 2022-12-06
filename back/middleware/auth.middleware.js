const jwt = require("jsonwebtoken");

//Get the token from the headers

 function isAuthorized (req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.SECRET);
    const userId = decodedToken._id;
    // console.log(decodedToken);
    req.Auth = {
      userId: userId,
    }
    next();
  } catch {
    res.status(401).json({
      error: new Error("Invalid request!"),
    });
  }
};

module.exports = isAuthorized;
