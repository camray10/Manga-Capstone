const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */
function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  const signedToken = jwt.sign(payload, SECRET_KEY);
  console.log('Payload:', payload);
  console.log('Signed Token:', signedToken);
  
  return signedToken;
}


module.exports = { createToken };
