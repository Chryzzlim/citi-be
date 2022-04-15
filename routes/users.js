const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");

router.post("/", UserController.register);
router.post("/auth", UserController.auth);


module.exports = router;
