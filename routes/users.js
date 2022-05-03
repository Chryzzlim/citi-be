const express = require("express");
const router = express.Router();
const UserController = require("../controllers/users");

router.get("/", UserController.getAll)
router.post("/", UserController.register);
router.post("/auth", UserController.auth);
router.put("/:id", UserController.update)


module.exports = router;
