const express = require("express");
const router = express.Router();
const checkAuth = require("./../middleware/check-auth");
const loginController = require("./../controllers/login");

module.exports = router;

router.post("/signin", loginController.signin);

router.get("/logout", () => {});