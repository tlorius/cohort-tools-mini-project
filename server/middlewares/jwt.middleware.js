const { expressjwt: jwt } = require("express-jwt");

//instantiation of the middle ware to validate jtw token

const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET,
  algorithms: ["HS256"],
  requestProperty: "payload",
  getToken: getTokenFromHeaders,
});
//function to extract the jwt token from the requests authorization headers
const getTokenFromHeaders = (req) => {
  //check if the token is available on the request headers
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    //get the encoded token string and return it
    const token = req.headers.authorization.split(" ")[1];
    return token;
  }
  return null;
};

//Export the middleware so that we can use it to create a protected route
module.exports = { isAuthenticated };
