const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.get("/allUsers", userController.getAllUsers);
router.get("/usersByCategory/:category", userController.getUsersByCategory);
router.put("/:publicKey", userController.updateUser);

module.exports = router;
