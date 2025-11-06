const { check, validationResult, param } = require("express-validator");
const helper = require("./helper");
const User = require("../models/user");
const Influencer = require("../models/influencer");
const Promotion = require("../models/promotion");
const Country = require("../models/country");
const Notification = require("../models/notification");

const validationResponse = (req, res, next) => {
    const errors = validationResult(req);
    let errors_msg = {};
    errors.array().map((err) => {
        errors_msg[err.param] = err.msg;
        return errors_msg;
    });
    if (errors.isEmpty()) {
        return next();
    }
    return res.status(422).json(helper.errorResponse(errors_msg, 422, "Validation Error"));
};

exports.validate = (method) => {
    switch (method) {
        case "request-message": {
            return [
                check("messageType")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("messageType field is required!")
                    .bail(),
                // check('user_name_list').trim().not().isEmpty()
                // .custom((value, { req }) => {
                //   if(req.body.messageType == 'postMessage' && value == '') {
                //     throw new Error('user_name_list field is required in postMessage');
                //   }
                //   return true;
                //  })
                // .bail(),
                check("message_id")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("message_id field is required!")
                    .bail(),
                check("user_email_list")
                    .not()
                    .isEmpty()
                    .withMessage("user email list is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "dashboard": {
            return [
                check("gender")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("gender field is required!")
                    .bail(),
                check("status")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("status field is required!")
                    .bail(),
                check("start_date")
                    .not()
                    .isEmpty()
                    .withMessage("start_date list is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "geo-stats": {
            return [
                check("locationType")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("status field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "total-users": {
            return [
                check("start_date").not().isEmpty().withMessage("start date is required!").bail(),
                check("end_date").not().isEmpty().withMessage("end date is required!").bail(),
                validationResponse,
            ];
        }
        case "verify-taglinedescription": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .bail()
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ email: req.body.email }).then((data) => {
                            if (!data) throw new Error("This email dosn't exist.");
                        })
                    )
                    .bail(),
                validationResponse,
            ];
        }
        case "get-verified": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .bail()
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ email: req.body.email }).then((data) => {
                            if (!data) throw new Error("This email dosn't exist.");
                        })
                    )
                    .bail(),
                validationResponse,
            ];
        }
        case "user-update-verified-screen-status": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .bail()
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ email: req.body.email }).then((data) => {
                            if (!data) throw new Error("This email dosn't exist.");
                        })
                    )
                    .bail(),
                check("status")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("status field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "user-verify-document": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .bail()
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ email: req.body.email.toLowerCase() }).then((data) => {
                            console.log({ data });
                            if (!data) throw new Error("This email dosn't exist.");
                        })
                    )
                    .bail(),
                validationResponse,
            ];
        }
        case "default-message": {
            return [
                check("messageType")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Message Type field is required!")
                    .bail()
                    .custom((value, { req }) => {
                        if (
                            ![
                                "userRequestType",
                                "photos",
                                "tagline",
                                "description",
                                "photosTagline",
                                "photosDescription",
                                "taglineAndDesc",
                                "photosTaglineDescription",
                                "postMessage",
                                "notification",
                            ].includes(value.trim())
                        ) {
                            throw new Error("Please pass valid message type.");
                        }
                        return true;
                    })
                    .bail(),
                validationResponse,
            ];
        }
        case "login": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    // .isEmail()
                    // .normalizeEmail()
                    // .withMessage('Invalid email address!')
                    .bail(),
                check("password")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Password field is required!")
                    .bail()
                    .isLength({ min: 6 })
                    .withMessage("Password has to be minimum 6 characters!")
                    .bail()
                    .isLength({ max: 30 })
                    .withMessage("Maximum 30 characters allowed for password!")
                    .bail(),
                validationResponse,
            ];
        }
        case "signup": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ email: req.body.email }).then((data) => {
                            console.log({ data });
                            if (data && data.email == req.body.email)
                                throw new Error("Email already exist.");
                        })
                    )
                    .bail(),
                check("country_code")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("country_code field is required!")
                    .bail(),
                check("country")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("country field is required!")
                    .bail(),

                check("user_name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Username is required!")
                    .isLength({ max: 30 })
                    .withMessage("Maximum 30 characters allowed for username!")
                    .custom((value, { req }) =>
                        User.findOne({ user_name: req.body.user_name.toLowerCase() }).then(
                            (data) => {
                                if (
                                    data &&
                                    data.user_name.toLowerCase() == req.body.user_name.toLowerCase()
                                )
                                    throw new Error("User name already taken.");
                            }
                        )
                    )
                    .bail(),
                check("password")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Password field is required!")
                    .bail()
                    .isLength({ min: 6 })
                    .withMessage("Password has to be minimum 6 characters!")
                    .bail()
                    .isLength({ max: 30 })
                    .withMessage("Maximum 30 characters allowed for password!")
                    .bail(),
                check("location")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Location field is required!")
                    .bail()
                    .isLength({ max: 100 })
                    .withMessage("Maximum 100 characters allowed for location!")
                    .bail(),
                check("age").trim().not().isEmpty().withMessage("Age is required").bail(),
                // .not(),
                // .isNumeric()
                // .withMessage('Age is invalid (must be a number)')
                // .bail(),
                check("gender").trim().not().isEmpty().withMessage("Gender is required!").bail(),
                check("body_type")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Body type is required!")
                    .bail(),
                check("ethnicity")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Ethnicity is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "signup2": {
            // when uploading image
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ email: req.body.email }).then((data) => {
                            if (!data) throw new Error("This email dosn't exist.");
                        })
                    )
                    .bail(),
                check("step_completed")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Current step field is required!")
                    .bail(),
                check("tagline")
                    .isLength({ min: 8 })
                    .withMessage("Tagline has to be minimum 8 characters!")
                    .bail()
                    .isLength({ max: 100 })
                    .withMessage("100 characters allowed for tagline!")
                    .bail(),
                check("description")
                    .isLength({ min: 30 })
                    .withMessage("Description has to be minimum 30 characters!")
                    .bail()
                    .isLength({ max: 500 })
                    .withMessage("500 characters allowed for description!")
                    .bail(),
                validationResponse,
            ];
        }
        case "signup3": {
            // when uploading image
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ email: req.body.email }).then((data) => {
                            console.log({ data });
                            if (!data) throw new Error("This email dosn't exist.");
                        })
                    )
                    .bail(),
                check("height")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Height field is required!")
                    .bail(),
                check("step_completed")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Current step field is required!")
                    .bail(),
                check("max_education")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Max education field is required!")
                    .bail(),
                check("is_smoker")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("is_smoker field is required!")
                    // .trim().not().isBoolean().bail()
                    // .withMessage('is_smoker field is boolean feild ( True/false ) ')
                    .bail(),
                check("occupation")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Occupation field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "signup4": {
            // when uploading image
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ email: req.body.email }).then((data) => {
                            console.log({ data });
                            if (!data) throw new Error("This email dosn't exist.");
                        })
                    )
                    .bail(),
                check("step_completed")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Current step field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "send-request": {
            return [
                check("message").trim().not().isEmpty().withMessage("Message is required.").bail(),
                check("receiver_id")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Female email id required")
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail(),
                validationResponse,
            ];
        }
        case "profile-info": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .bail()
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail(),
                validationResponse,
            ];
        }
        case "user-by-name": {
            return [
                check("user_name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("User name field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "update-date": {
            return [
                check("user_name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("user_name field is required!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ user_name: req.body.user_name }).then((data) => {
                            console.log({ data });

                            if (!data) throw new Error(`This ${req.body.user_name} dosn\'t exist.`);
                        })
                    )
                    .bail(),
                check("date_id")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("date_id field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "update-draft-status": {
            return [
                check("date_status")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("date_status field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "create-date": {
            return [
                check("user_name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("user_name field is required!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ user_name: req.body.user_name }).then((data) => {
                            console.log({ data });
                            if (!data) throw new Error("This user_name dosn't exist.");
                        })
                    )
                    .bail(),
                check("country_code")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("country_code field is required!")
                    .bail(),
                check("country")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("country field is required!")
                    .bail(),
                check("location")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Location field is required!")
                    .bail(),
                // check('standard_class_date').trim().not().isEmpty()
                // .withMessage('standard_class_date field is required!')
                // .bail(),
                // check('middle_class_dates').trim().not().isEmpty()
                //   .withMessage('middle_class_dates field is required!')
                //   .bail(),
                // check('executive_class_dates').trim().not().isEmpty()
                //   .withMessage('executive_class_dates field is required!')
                //   .bail(),
                check("date_length")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("date_length field is required!")
                    .bail(),
                check("price")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("price field is required!")
                    .bail(),
                check("date_details")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("date_details field is required!")
                    .bail(),
                // check('date_status').trim().not().isEmpty()
                //   .withMessage('date_status field is required!')
                //   .bail(),
                validationResponse,
            ];
        }
        case "create-promotion": {
            return [
                check("creator_name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("creator_name field is required!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ user_name: req.body.creator_name }).then((data) => {
                            console.log({ data });
                            if (!data)
                                throw new Error(
                                    "This creator_name dosn't exist. Only registered user can create the promotion."
                                );
                        })
                    )
                    .bail(),
                check("source")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("source field is required. ex. fb, insta, etc")
                    .bail(),
                check("coupon_amount")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("coupon_amount field is required.")
                    .bail(),
                check("influencer_name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("influencer_name field is required.")
                    .bail(),
                check("influencer_name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("influencer_name field is required.")
                    .bail(),
                check("coupon")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("coupon field is required. Please create a uniqe coupon.")
                    .bail()
                    .custom((value, { req }) =>
                        Promotion.findOne({ coupon: req.body.coupon }).then((data) => {
                            console.log({ data });
                            if (data)
                                throw new Error(
                                    `${req.body.coupon} is already taken. Please try with another code.`
                                );
                        })
                    )
                    .bail(),
                validationResponse,
            ];
        }
        case "get-date": {
            return [
                check("current_page")
                    .trim()
                    .not()
                    .isEmpty()
                    .isNumeric()
                    .withMessage("current_page field is required and it should be number!")
                    .bail(),
                validationResponse,
            ];
        }
        case "create-customer": {
            return [
                check("company_id").trim().not().isEmpty().withMessage("Company_id is required"),
                check("title").trim().not().isEmpty().withMessage("Title is invalid"),
                check("address_line_1")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Address_line_1 is invalid"),
                check("address_line_2")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Address_line_2 is invalid"),
                check("city").trim().not().isEmpty().withMessage("City is invalid"),
                check("country").trim().not().isEmpty().withMessage("Country is invalid"),
                check("postcode").trim().not().isEmpty().withMessage("Postcode is invalid"),
                check("reference")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Reference is required")
                    .bail()
                    .not()
                    .isNumeric()
                    .withMessage("Reference is invalid (must be a number)"),
            ];
        }
        case "customer-by-id": {
            return [check("id").trim().not().isEmpty().withMessage("Customer id required")];
        }
        case "update": {
            return [
                check("full_name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Fullname field is required!")
                    .bail()
                    .isLength({ min: 6 })
                    .withMessage("Name has to be minimum 8 characters!")
                    .bail()
                    .isLength({ max: 30 })
                    .withMessage("Maximum 30 characters allowed for full name!")
                    .bail(),
                check("type")
                    .not()
                    .isEmpty()
                    .withMessage("Type field is required!")
                    .bail()
                    .isInt({ min: 1, max: 2 })
                    .withMessage("Accepting only 1 & 2")
                    .bail(),
                validationResponse,
            ];
        }
        case "forget-password": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .bail()
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail(),
                validationResponse,
            ];
        }
        case "validate-email": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .bail()
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail(),
                validationResponse,
            ];
        }
        case "email-verification": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .bail()
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail(),
                check("token")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Token field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "verify-email": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .bail()
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail(),
                validationResponse,
            ];
        }
        case "validate-username": {
            return [
                check("user_name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Username field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "reset-password": {
            return [
                check("password")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Password field is required!")
                    .bail()
                    .isLength({ min: 6 })
                    .withMessage("Password has to be minimum 6 characters!")
                    .bail()
                    .isLength({ max: 30 })
                    .withMessage("Maximum 30 characters allowed for password!")
                    .bail(),
                validationResponse,
            ];
        }
        case "change-password": {
            return [
                check("old_password")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Old Password field is required!")
                    .bail()
                    .isLength({ min: 6 })
                    .withMessage("Old Password has to be minimum 6 characters!")
                    .bail()
                    .isLength({ max: 30 })
                    .withMessage("Maximum 30 characters allowed for old password!")
                    .bail(),
                check("new_password")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("New Password field is required!")
                    .bail()
                    .isLength({ min: 6 })
                    .withMessage("New Password has to be minimum 6 characters!")
                    .bail()
                    .isLength({ max: 30 })
                    .withMessage("Maximum 30 characters allowed for new password!")
                    .bail(),
                validationResponse,
            ];
        }
        case "add-notification": {
            return [
                check("user_email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("user_email field is required!")
                    .bail(),
                check("title")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("title field is required!")
                    .bail(),
                check("message")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("message field is required!")
                    .bail(),
                check("type").trim().not().isEmpty().withMessage("type field is required!").bail(),
                check("type").trim().not().isEmpty().withMessage("type field is required!").bail(),
                validationResponse,
            ];
        }
        case "get-notification": {
            return [
                check("id")
                    .trim()
                    .not()
                    .isEmpty()
                    .isLength({ min: 10 })
                    .withMessage("Valid notification id is required")
                    .bail(),
                validationResponse,
            ];
        }
        case "get-notification-email": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .isLength({ min: 10 })
                    .withMessage("Valid user email is required")
                    .bail(),
                validationResponse,
            ];
        }
        case "read-all-notification": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    // .bail()
                    // .custom((value, { req }) => Notification.findOne({ email: req.body.email })
                    //   .then((data) => {
                    //     console.log({data})
                    //     if (!data) throw new Error("Email not exist.");
                    //   }))
                    .bail(),
                validationResponse,
            ];
        }
        case "delete-notification":
        case "update-notification": {
            return [
                check("id")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Notification unique id field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "add-country": {
            return [
                check("name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Country name field is required!")
                    .custom((value, { req }) =>
                        Country.findOne({ name: req.body.name }).then((data) => {
                            console.log({ data });
                            if (data) throw new Error("Country already exist.");
                        })
                    )
                    .bail(),
                validationResponse,
            ];
        }
        case "update-country": {
            return [
                check("id")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Country unique id field is required!")
                    .bail(),
                check("name")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Country name field is required!")
                    .custom((value, { req }) =>
                        Country.findOne({ name: req.body.name }).then((data) => {
                            console.log({ data });
                            if (data) throw new Error("Country already exist.");
                        })
                    )
                    .bail(),
                validationResponse,
            ];
        }
        case "delete-country": {
            return [
                check("name").not().isEmpty().withMessage("Country name is required!").bail(),
                validationResponse,
            ];
        }
        case "update-status": {
            return [
                check("status").trim().not().isEmpty().withMessage("status is required").bail(),

                validationResponse,
            ];
        }
        case "update-date-status": {
            return [
                check("status").trim().not().isEmpty().withMessage("status is required").bail(),
                check("ids").not().isEmpty().withMessage("ids field is required!").bail(),
                validationResponse,
            ];
        }
        case "request-info": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .isEmail()
                    .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        User.findOne({ email: req.body.email }).then((data) => {
                            console.log({ data });
                            if (!data) throw new Error("Email not exist.");
                        })
                    )
                    .bail(),
                check("message")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("message field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "delete-by-ids": {
            return [
                check("ids").not().isEmpty().withMessage("ids field is required!").bail(),
                validationResponse,
            ];
        }
        case "seen-by-ids": {
            return [
                check("ids").not().isEmpty().withMessage("ids field is required!").bail(),
                validationResponse,
            ];
        }
        case "request-chat": {
            return [
                check("recieverId").not().isEmpty().withMessage("reciever id missing!").bail(),
                check("message").not().isEmpty().withMessage("message missing!").bail(),
                check("dateId").not().isEmpty().withMessage("date id missing!").bail(),
                check("isSuperInterested")
                    .isBoolean()
                    .withMessage("Must be a boolean true or false"),
                validationResponse,
            ];
        }
        case "accept-chat": {
            return [
                check("chatRoomId").not().isEmpty().withMessage("chat room id missing!").bail(),
                check("senderId").not().isEmpty().withMessage("sender id missing!").bail(),
                validationResponse,
            ];
        }
        case "block-chat": {
            return [
                check("chatRoomId").not().isEmpty().withMessage("chat room id missing!").bail(),
                check("recieverId").not().isEmpty().withMessage("reciever id missing!").bail(),
                validationResponse,
            ];
        }
        case "unBlock-chat": {
            return [
                check("chatRoomId").not().isEmpty().withMessage("chat room id missing!").bail(),
                check("recieverId").not().isEmpty().withMessage("reciever id missing!").bail(),
                validationResponse,
            ];
        }
        case "user-block": {
            return [
                check("userId")
                    .not()
                    .isEmpty()
                    .withMessage("User id whom to block is missing!")
                    .bail(),
                validationResponse,
            ];
        }
        case "influencer-updated": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .bail()
                    .isEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        Influencer.findOne({ email: req.body.email.toLowerCase() }).then((data) => {
                            if (!data) throw new Error("This email dosn't exist.");
                        })
                    )
                    .bail(),
                validationResponse,
            ];
        }
        case "influencer": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .isEmail()
                    // .normalizeEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        Influencer.findOne({ email: req.body.email.toLowerCase() }).then((data) => {
                            if (data && data.email == req.body.email.toLowerCase())
                                throw new Error("Email already exist.");
                        })
                    )
                    .bail(),
                check("name").trim().not().isEmpty().withMessage("name field is required!").bail(),
                check("code")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("code field is required!")
                    .bail()
                    .custom((value, { req }) =>
                        Influencer.findOne({ code: req.body.code.toLowerCase() }).then((data) => {
                            if (data && data.code == req.body.code.toLowerCase())
                                throw new Error("Code already exist.");
                        })
                    )
                    .bail(),
                check("promo")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("promo field is required!")
                    .bail(),
                check("source")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("source field is required!")
                    .bail(),

                validationResponse,
            ];
        }
        case "influencer-exists": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .isEmail()
                    .withMessage("Invalid email address!")
                    .bail(),
                validationResponse,
            ];
        }
        case "influencer-update-status": {
            return [
                check("status")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Status field is required!")
                    .bail(),
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .isEmail()
                    .withMessage("Invalid email address!")
                    .bail()
                    .custom((value, { req }) =>
                        Influencer.findOne({ email: req.body.email.toLowerCase() }).then((data) => {
                            if (!data) throw new Error(`This ${req.body.email} dosn\'t exist.`);
                        })
                    )
                    .bail(),
                validationResponse,
            ];
        }
        case "influencer-delete": {
            return [
                check("email")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("Email field is required!")
                    .isEmail()
                    .withMessage("Invalid email address!")
                    .bail(),
                validationResponse,
            ];
        }
        case "influencer-code-exists": {
            return [
                check("code").trim().not().isEmpty().withMessage("Code field is required!").bail(),
                validationResponse,
            ];
        }
        case "users-counts-by-date": {
            return [
                check("start_date").not().isEmpty().withMessage("Start date is required!").bail(),
                check("end_date").not().isEmpty().withMessage("End date is required!").bail(),
                check("status")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("status field is required!")
                    .bail(),
                check("user_type")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("User Type field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "update-date-warning-status": {
            // when uploading image
            return [
                check("date_warning_popup")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("date_warning_popup field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "update-image-warning-popup": {
            // when uploading image
            return [
                check("image_warning_popup")
                    .trim()
                    .not()
                    .isEmpty()
                    .withMessage("image_warning_popup field is required!")
                    .bail(),
                validationResponse,
            ];
        }
        case "save-aspiration": {
            return [
                check("categatoryName")
                    .not()
                    .isEmpty()
                    .withMessage("Category name is required!")
                    .bail(),
                check("categatoryId")
                    .not()
                    .isEmpty()
                    .withMessage("Category id is required!")
                    .bail(),
                check("aspirationName")
                    .not()
                    .isEmpty()
                    .withMessage("Aspiration name is required!")
                    .bail(),
                check("aspirationId")
                    .not()
                    .isEmpty()
                    .withMessage("Aspiration id is required!")
                    .bail(),
                validationResponse,
            ];
        }
        default:
            return [];
    }
};
