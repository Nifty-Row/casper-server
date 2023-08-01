const express = require("express");
const userController = require("../controllers/user.controller");
const router = express.Router();

router.post("/addNewWallet", userController.addNewWallet);
router.put("/addNewWallet", userController.addNewWallet);
router.get("/allUsers", userController.getAllUsers);
router.get("/usersByCategory/:category", userController.getUsersByCategory);
router.get("/userByKey/:publicKey", userController.getUserByKey);
router.put("/:publicKey", userController.updateUser);

module.exports = router;
