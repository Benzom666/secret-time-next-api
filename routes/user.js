const express = require("express");
// const { check } = require('express-validator/check');
const userController = require("../controllers/v1/user");

const validation = require("../helpers/validation");
const validateApi = require("../helpers/validateApi");

const router = express.Router();

/* get all users */
router.get("/", validateApi, userController.getAllUsers);

router.get("/profile-info", validation.validate("profile-info"), userController.getUserDetail);

router.get(
    "/user-by-name",
    validateApi,
    validation.validate("user-by-name"),
    userController.getUser
);

/* get user info */
router.get("/name-or-email", validateApi, userController.nameOrEmail);

/* Update user profile status by admin */
router.post(
    "/update-status",
    validateApi,
    validation.validate("update-status"),
    userController.updateStatus
);

/* Request more info */
router.post(
    "/request-info",
    validateApi,
    validation.validate("request-info"),
    userController.requestInfo
);
// statistics

router.get("/users-stats", validateApi, userController.userStats);

router.get("/audience-reach", validateApi, userController.audienceReach);

router.post(
    "/get-verified",
    validateApi,
    validation.validate("getVerified"),
    userController.getVerified
);

/* Verify selfie and document for badge */
router.put(
    "/verify-document",
    validateApi,
    validation.validate("user-verify-document"),
    userController.verifyDocument
);

/* Update Verified screen status */
router.put(
    "/update-verifiedscreen-status",
    validateApi,
    validation.validate("user-update-verified-screen-status"),
    userController.updateVerifiedScreenStatus
);

/* verify tagline, description and image */
router.post(
    "/verify-taglinedescription",
    validateApi,
    validation.validate("verify-taglinedescription"),
    userController.verifyTaglineDescription
);

router.put(
    "/user-block",
    validateApi,
    validation.validate("user-block"),
    userController.blockUserRequest
);

/* No need of token ( PUBLIC ) */

//TODO

// 1. Portal-Token ( to verify the secret time)
// 2. Bearer token ( after login. in header )

/* signup */
router.post("/signup", validation.validate("signup"), userController.signup);
// router.post('/signup', userController.signup);

// image upload
// tagline
// description
// step count
router.post("/signup/step2", validation.validate("signup2"), userController.signup2);

router.post("/signup/step3", validation.validate("signup3"), userController.signup3);

router.post("/signup/step4", validation.validate("signup4"), userController.signup4);

/* validate email account */
router.post(
    "/email-verification",
    validation.validate("email-verification"),
    userController.emailVerification
);

/* login */
router.post("/login", validation.validate("login"), userController.login);

/* validateuser by email  */
router.post(
    "/validatebyEmail",
    validation.validate("validate-email"),
    userController.validatebyEmail
);

/* validateuser by username */
router.post(
    "/validatebyUsername",
    validation.validate("validate-username"),
    userController.validatebyUsername
);

/* forget password */
router.post(
    "/forget-password",
    validation.validate("forget-password"),
    userController.forgetPassword
);

/* reset password */
router.post("/reset-password", validation.validate("reset-password"), userController.resetPassword);

/* email verification */
router.post("/verify-email", validation.validate("verify-email"), userController.verifyEmail);

/* Update dates warning popup status */
router.post(
    "/update-date-warning-status",
    validateApi,
    validation.validate("update-date-warning-status"),
    userController.updateDateWarningStatus
);

/* Update dates warning popup status */
router.post(
    "/update-image-warning-popup/:userId",
    // validateApi,
    validation.validate("update-image-warning-popup"),
    userController.updateImageWarningPopup
);

router.post(
    "/save-aspiration",
    validateApi,
    validation.validate("save-aspiration"),
    userController.saveAspiration
);

module.exports = router;
