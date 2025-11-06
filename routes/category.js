const express = require("express");
const validateApi = require("../helpers/validateApi");
const categoryController = require("../controllers/v1/category.js");

const router = express.Router();

router.get("/", validateApi, categoryController.getAllList);

module.exports = router;
