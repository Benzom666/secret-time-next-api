/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const async = require("async");
const bcrypt = require("bcrypt");
const randomNumber = require("random-number");
const mongoose = require("mongoose");
const ejs = require("ejs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../../models/user");
const helper = require("../../helpers/helper");
const _ = require("lodash");

const allowedMimeTypes = [".png", ".jpg", "image/jpeg"];
const filetypes = /jpeg|jpg|png/;

// for upload to s3
const aws = require("aws-sdk");
const multer = require("multer");
const path = require("path");
const multerS3 = require("multer-s3");
const request = require("request");

const s3Config = new aws.S3({
    accessKeyId: process.env.AWS_IAM_USER_KEY,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET,
    Bucket: process.env.AWS_BUCKET_NAME,
});

/**
 * Listing of users based on full_name, sort and order
 * Default current_page is 1 and per_page will be 10
 * @param current_page int
 * @param per_page int
 * @param sort string
 * @param order int
 * @param full_name string ( fullname %fullname% )
 */
exports.uploadFiles = async (req, res) => {
    try {
        const maxCount = 4;
        const upload = multer({
            fileFilter: (req, file, cb) => {
                console.log("here is the file", file);

                if (_.isEmpty(file)) {
                    return cb(new Error("Files required."));
                }

                const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
                const mimetype = filetypes.test(file.mimetype);
                if (mimetype && extname) {
                    return cb(null, true);
                } else {
                    cb("Error: Allow images only of extensions jpeg|jpg|png !");
                }
                cb(null, true);
            },
            storage: multerS3({
                s3: s3Config,
                bucket: process.env.AWS_BUCKET_NAME,
                acl: "public-read",
                contentType: multerS3.AUTO_CONTENT_TYPE,
                metadata(req, file, cb) {
                    cb(null, { fieldName: file.originalname });
                },
                key(req, file, cb) {
                    cb(null, `secret-time/uploads/${file.originalname}`);
                },
            }),
        }).array("files", maxCount);

        upload(req, res, (err) => {
            if (err && err.code == "LIMIT_UNEXPECTED_FILE") {
                console.info("file upload is failed", err);
                return res
                    .status(500)
                    .json(
                        helper.errorResponse(
                            { file: `${err.message} or more then ${maxCount} files are passed` },
                            500,
                            err.message
                        )
                    );
            }

            if (req.files.length) {
                req.files = req.files.map((row) => {
                    row.location = row.location.replace(
                        "lesociety.s3.ca-central-1.amazonaws.com",
                        "d2hill0ae3zx76.cloudfront.net"
                    );
                    return row;
                });
                return res
                    .status(200)
                    .json(
                        helper.successResponse(
                            { files: helper.s3ImageResponse(req.files) },
                            200,
                            "Assets uploaded to s3!"
                        )
                    );
            } else {
                return res.status(400).json(helper.errorResponse([], 400, "Files required."));
            }
        });
    } catch (err) {
        return res
            .status(400)
            .json(helper.errorResponse(err.message, 400, "Something went wrong catch.", err));
    }
};
