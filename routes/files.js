const express = require('express');
// const { check } = require('express-validator/check');
const filesController = require('../controllers/v1/files');
const validation = require('../helpers/validation');
const validateApi = require('../helpers/validateApi');

const router = express.Router();

/* get all users */
router.post('/', filesController.uploadFiles);


module.exports = router;
