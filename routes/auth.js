const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("./verifyToken");
const {
  loginSchema,
  registerSchema,
  registerAuthorSchema,
  loginAuthorSchema,
} = require("../validation");
const Author = require("../models/Author");

let refreshTokens = [];

router.post("/refresh", (req, res) => {
  const refreshToken = req.body.token;

  if (!refreshToken) return res.status(401).json("You are not authenticated");
  if (!refreshTokens.includes(refreshToken))
    return res.status(403).json("Refresh token is not valid!");

  jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);

    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);

    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });
});

router.post("/register", async (req, res) => {
  try {
    const result = await registerSchema.validateAsync(req.body);

    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (err) {
    if (err.isJoi === true) res.status(422).json(err);
    else res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = await loginSchema.validateAsync(req.body);

    const user = await User.findOne({ name: req.body.name });
    !user && res.status(401).json("Wrong Credentials name!");
    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    originalPassword != req.body.password &&
      res.status(401).json("Wrong Credentials!");

    const accessToken = generateAccessToken(user);

    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);

    const { password, ...others } = user._doc;

    res.status(200).json({ ...others, accessToken, refreshToken });
  } catch (err) {
    if (err.isJoi === true) res.status(422).json(err.details[0].message);
    else res.status(500).json(err);
  }
});

router.post("/author/register", async (req, res) => {
  try {
    const result = await registerAuthorSchema.validateAsync(req.body);

    const newAuthor = new Author({
      name: result.name,
      password: CryptoJS.AES.encrypt(
        req.body.password,
        process.env.PASS_SEC
      ).toString(),
      books: result.books,
      image_url: result.image_url,
      description: result.description,
    });
    const savedAuthor = await newAuthor.save();
    res.status(200).json(savedAuthor);
  } catch (err) {
    if (err.isJoi === true) res.status(422).json(err);
    else res.status(500).json(err);
  }
});

router.post("/author/login", async (req, res) => {
  try {
    const result = await loginAuthorSchema.validateAsync(req.body);

    const author = await Author.findOne({ name: result.name });
    !author && res.status(401).json("Wrong Credentials!");
    const hashedPassword = CryptoJS.AES.decrypt(
      author.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
    originalPassword != result.password &&
      res.status(401).json("Wrong Credentialsl");

    const accessToken = generateAccessToken(author);

    const refreshToken = generateRefreshToken(author);
    refreshTokens.push(refreshToken);

    const { password, ...others } = author._doc;

    res.status(200).json({ ...others, accessToken, refreshToken });
  } catch (err) {
    if (err.isJoi === true) res.status(422).json(err.details[0].message);
    else res.status(500).json(err);
  }
});

module.exports = router;
