const express = require('express');
const validation = require('../helpers/validation');
const influencerController = require('../controllers/v1/influencer');
const validateApi = require('../helpers/validateApi');

const router = express.Router();

/* get all message */
router.get('/', validateApi, influencerController.getAllInfluencer);
router.get('/stats', validateApi, influencerController.getStats);
router.get('/exists', validateApi, validation.validate('influencer-exists'), influencerController.exists);
router.get('/code-exists', validateApi, validation.validate('influencer-code-exists'), influencerController.codeExists);
router.delete('/', validateApi, validation.validate('influencer-delete'), influencerController.delete);

router.put('/update-status', validateApi, validation.validate('influencer-update-status'), influencerController.updateStatus);

router.post('/', validateApi, validation.validate('influencer'), influencerController.create);

router.put('/', validateApi, validation.validate('influencer-updated'), influencerController.update);

module.exports = router;