const express = require("express");
const router = new express.Router();

const authenticateMiddleware = require("../middleware/authenticate");
const {
  createAccount,
  loginToAccount,
  getAccountInfo,
  logoutAccount,
} = require("../controllers/usersController");

//create account (public)
router.post("/users/signup", createAccount);

//login to account(public)
router.post("/users/login", loginToAccount);

//login to account(public)
router.post("/users/logout", authenticateMiddleware, logoutAccount);

//get my account info
router.get("/users/me", authenticateMiddleware, getAccountInfo);

//edit my account info
router.patch("/users/me");

//upload profile pic
router.post("/users/me/avatar");

//edit profile pic
router.patch("/users/me/avatar");

module.exports = router;
