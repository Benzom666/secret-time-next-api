const express = require('express');
const validation = require('../helpers/validation');
const defaultMessagesController = require('../controllers/v1/default-messages');
const validateApi = require('../helpers/validateApi');

const router = express.Router();

/* get all message */
router.get('/', validateApi, validation.validate('default-message'), defaultMessagesController.getAllMessages);

router.post('/requestMessage', validateApi, validation.validate('request-message'), defaultMessagesController.requestMessage);

module.exports = router;