const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const accountController = require("../controllers/account.controller");

router.get("/me", authMiddleware, accountController.getMyProfile);
router.patch("/me", authMiddleware, accountController.updateMyProfile);
router.patch("/change-password", authMiddleware, accountController.changeMyPassword);

module.exports = router;
