
const express = require('express');
const validation = require('../helpers/validation');
const validateApi = require('../helpers/validateApi');
const dashboardController = require('../controllers/v1/dashboard');

const router = express.Router();

router.get('/registration', validateApi, validation.validate('dashboard'), dashboardController.registrationCompleted);
router.get('/geo-stats', validateApi, dashboardController.geoStats);

router.get('/total-users', validateApi, dashboardController.totalUsers);
router.get('/total-users-with-percentage', validateApi, dashboardController.newTotalUsersWithPercentage); // not used in application yet
router.get('/users-counts-with-percentage', validateApi, dashboardController.usersCountWithPercentage);
router.get('/users-counts-by-date', validateApi, validation.validate('users-counts-by-date'), dashboardController.usersCountByDate);

module.exports = router;