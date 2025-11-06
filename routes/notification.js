const express = require('express');
const validation = require('../helpers/validation');
const notificationController = require('../controllers/v1/notification');
const validateApi = require('../helpers/validateApi');

const router = express.Router();

/* get all notification of a user */
router.get('/', validateApi, notificationController.getAllNotification);

/* get a notification detail. */
router.get('/:id', validateApi, validation.validate('get-notification'), notificationController.getNotification);
router.get('/:email', validateApi, validation.validate('get-notification-email'), notificationController.getUnverifiedScreenMessage);


// /* add a new notification */
router.post('/', validateApi, validation.validate('add-notification'), notificationController.addNotification);


router.delete('/', validateApi, validation.validate('delete-notification'), notificationController.delete);


/* update a notification */
router.put('/', validateApi, validation.validate('update-notification'), notificationController.update);

/* Make all notification as read of a user */
router.put('/read-all-notification', validateApi, validation.validate('read-all-notification'), notificationController.readAllNotification);


module.exports = router;