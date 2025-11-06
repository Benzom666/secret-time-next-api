
const express = require('express');
const validation = require('../helpers/validation');
const validateApi = require('../helpers/validateApi');
const chatController = require('../controllers/v1/chat.js');

const router = express.Router();

/* create room or chat request */
router.post('/request', validateApi, validation.validate('request-chat'), chatController.createRequest);
router.post('/accept', validateApi, validation.validate('accept-chat'), chatController.acceptRequest);
router.post('/block', validateApi, validation.validate('block-chat'), chatController.blockRequest);
router.post('/unBlock', validateApi, validation.validate('unBlock-chat'), chatController.unBlockRequest);
router.get('/chatroom-list', validateApi, chatController.chatRoomList);
router.get('/chatroom-history', validateApi, chatController.chatRoomHistory);

router.get('/exist', validateApi, chatController.chatRoomExists); // check if room exists b/w two users on a particular date

router.delete('/chat-clear', validateApi, validation.validate('block-chat'), chatController.chatClear);

module.exports = router;