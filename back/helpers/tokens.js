const jwt = require("jsonwebtoken");
const { SECRET_KEY } = require("../config");

/** return signed JWT from user data. */
function createToken(user) {
  console.assert(user.isAdmin !== undefined,
      "createToken passed user without isAdmin property");

 // Create the payload for the JWT
  let payload = {
    username: user.username,
    isAdmin: user.isAdmin || false,
  };

  // Sign the payload with the SECRET_KEY and return the signed token
  const signedToken = jwt.sign(payload, SECRET_KEY);

  // Log the payload and signed token for debugging purposes
  console.log('Payload:', payload);
  console.log('Signed Token:', signedToken);

  return signedToken;
}

module.exports = { createToken };


module.exports = { createToken };
