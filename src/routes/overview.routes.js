const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/auth.middleware");
const { isAdmin } = require("../middlewares/role.middleware"); // ⭐ QUAN TRỌNG
const { getOverviewStats } = require("../controllers/overview.controller");

router.get("/overview", authMiddleware, isAdmin, getOverviewStats);

module.exports = router;
