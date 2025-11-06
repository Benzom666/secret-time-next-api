const express = require('express');
const validation = require('../helpers/validation');
const countryController = require('../controllers/v1/country');
const validateApi = require('../helpers/validateApi');

const router = express.Router();

/* get all country */
router.get('/', countryController.getAllCountry);

/* add a new country*/
router.post('/', validateApi, validation.validate('add-country'), countryController.addCountry);

/* Delete country by name */
router.delete('/', validateApi, validation.validate('delete-country'), countryController.delete);


/* update a country*/
router.put('/', validateApi, validation.validate('update-country'), countryController.update);


module.exports = router;