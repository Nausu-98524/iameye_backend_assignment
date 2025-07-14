const express = require("express");
const {
  registerControllers,
  loginControllers,
} = require("../controllers/auth.controller");
const router = express.Router();

router.post("/register", registerControllers);

router.post("/login", loginControllers);

//router.get("/current-user", authMiddleware, getCurrentUserControllers);

module.exports = router;
