const express = require("express");
const validateApi = require("../helpers/validateApi");
const aspirationController = require("../controllers/v1/aspiration.js");

const router = express.Router();

router.get("/", validateApi, aspirationController.getAllList);

module.exports = router;
