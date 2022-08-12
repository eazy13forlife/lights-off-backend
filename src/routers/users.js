const express = require("express");
const router = new express.Router();

//create account (public)
router.post("/users/signup");

//login to account(public)
router.post("/users/login");

//get my account info
router.get("users/me");

//edit my account info
router.patch("/users/me");

//upload profile pic
router.post("/users/me/avatar");

//edit profile pic
router.patch("/users/me/avatar");
