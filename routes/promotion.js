const express = require('express');
// const { check } = require('express-validator/check');
const promotionController = require('../controllers/v1/promotion');
const validation = require('../helpers/validation');
const validateApi = require('../helpers/validateApi');

const router = express.Router();

/* get all users */
router.post('/create', validation.validate('create-promotion'), promotionController.create);


module.exports = router;
