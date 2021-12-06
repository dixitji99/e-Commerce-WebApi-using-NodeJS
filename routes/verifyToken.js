const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SEC, (err, user) => {
      if (err) return res.status(403).json("Token is not valid!");
      req.user = user;
      next();
    });
  } else {
    return res.status(401).json("you are not authenticated!");
  }
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    console.log(req.body.author, req.user.id);
    if (req.body.author === req.user.id) {
      next();
    } else {
      res.status(403).json("You are not allowed to do that!");
    }
  });
};

const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
    },
    process.env.JWT_SEC,
    {
      expiresIn: "1d",
    }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      name: user.name,
    },
    "myRefreshSecretKey"
  );
};
module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  generateAccessToken,
  generateRefreshToken,
};
