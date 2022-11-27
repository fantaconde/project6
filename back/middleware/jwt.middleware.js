const { expressjwt: jwt } = require("express-jwt");

const checkAuth = jwt({
  secret: process.env.SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});

//Help use to extract JWT token from the headers

function getTokenFromHeaders(req) {
  const {
    headers: { authorization },
  } = req;

  if (authorization && authorization.split(" ")[0] === "Bearer") {
    return authorization.split(" ")[1];
  }

  return null;
}

module.exports = {
  checkAuth,
};
