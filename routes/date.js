const express = require("express");
// const { check } = require('express-validator/check');
const dateController = require("../controllers/v1/date");
const validation = require("../helpers/validation");
const validateApi = require("../helpers/validateApi");

const router = express.Router();

/* get all dates */

router.get("/", validateApi, validation.validate("get-date"), dateController.getAllDates);

router.get("/stats", validateApi, dateController.getStats);

router.get("/draft-date", validateApi, dateController.getDraftDate);

// date create
router.post("/", validateApi, validation.validate("create-date"), dateController.date);

// date update
router.post("/update", validateApi, validation.validate("update-date"), dateController.updateDate);

// draft date update
router.post(
    "/update-draft-status",
    validateApi,
    validation.validate("update-draft-status"),
    dateController.updateDraftStatus
);

// date status update
router.post("/update-status", validateApi, dateController.updateStatus);

// delete draft date, used on frontend
router.delete("/", validateApi, dateController.deleteDate);

// delete drafts by draft id, used in admin pannel
router.delete(
    "/delete-by-ids",
    validation.validate("delete-by-ids"),
    validateApi,
    dateController.deleteDateByIds
);

// Update date to is_new false, used in admin pannel
router.post(
    "/seen-by-ids",
    validation.validate("seen-by-ids"),
    validateApi,
    dateController.seenDatesByIds
);

module.exports = router;
