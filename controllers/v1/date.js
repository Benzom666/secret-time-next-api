const mongoose = require("mongoose");
const Dates = require("../../models/dates");
const helper = require("../../helpers/helper");
const User = require("../../models/user");
const ChatRoom = require("../../models/chat_room");

/**
 * Listing of users based on full_name, sort and order
 * Default current_page is 1 and per_page will be 10
 * @param current_page int
 * @param per_page int
 * @param sort string
 * @param order int
 */

exports.getAllDates = async (req, res) => {
    console.log("req", req.query);
    let {
        current_page = 1,
        per_page = 10,
        location = "",
        province = "",
        sort = "created_at",
        order = -1,
        assetOnly = false,
        status = "",
    } = req.query;

    try {
        console.log("current_page", current_page);

        let userDetails = await User.findOne({ _id: req.datajwt.userdata._id });
        let userNameCondition;
        let { gender, country_code, role, user_name } = userDetails;
        if (req.query.user_name) {
            userNameCondition = user_name &&
                user_name.length && {
                    $and: [
                        {
                            user_name: {
                                $nin: [
                                    ...userDetails.blocked_users_by_self,
                                    ...userDetails.blocked_by_others,
                                ],
                            },
                        },
                        { user_name: { $eq: req.query.user_name } },
                    ],
                };
        } else {
            userNameCondition = user_name &&
                user_name.length && {
                    user_name: {
                        $nin: [
                            ...userDetails.blocked_users_by_self,
                            ...userDetails.blocked_by_others,
                        ],
                    },
                };
        }

        // only female can search for any country
        // or if it's admin then he can search any location
        if (
            role == 2 ||
            ((gender == "female" || gender == "F" || gender == "f") && req.query.country_code)
        ) {
            country_code = req.query.country_code;
        }

        current_page = parseInt(current_page);
        per_page = parseInt(per_page);

        if (current_page < 1)
            res.status(400).json(
                helper.errorResponse([], 400, "Invalid page number, should start with 1.")
            );

        const skip = per_page * (current_page - 1);

        let query = {
            status: { $nin: [3, 6] }, // by default warned will be ignored
            date_status: true, // do not fetch draft dates
            ...(location && location.length && { location: { $eq: location } }),
            ...(country_code && country_code.length && { country_code: { $eq: country_code } }),
            ...(province && province.length && { province: { $eq: province } }),
            ...(status && status.length && { status: { $eq: +status } }),
            ...userNameCondition,
        };

        if (req.query.user_name) {
            delete query.date_status;
        }

        if (status == 5) {
            // to return new dates
            query = { ...query, is_new: true, status: { $ne: 4 } };
        }

        const total_dates = await Dates.countDocuments(query).collation({
            locale: "en",
            strength: 2,
        });

        console.log(total_dates);
        const total_pages = Math.ceil(total_dates / per_page);

        if (total_pages == 0) {
            return res.status(400).json(helper.errorResponse([], 400, "No dates found"));
        }

        if (current_page > total_pages) {
            return res
                .status(400)
                .json(
                    helper.errorResponse(
                        [],
                        400,
                        "Invalid page number, can't be greater than total pages."
                    )
                );
        }

        let datesObj = Dates.aggregate([
            {
                $lookup: {
                    from: "users",
                    localField: "user_name",
                    foreignField: "user_name",
                    as: "user_data",
                    ...(assetOnly && {
                        pipeline: [
                            {
                                $project: {
                                    _id: 0,
                                    images: 1,
                                    un_verified_images: 1,
                                    description: 1,
                                    tagline: 1,
                                },
                            },
                        ],
                    }),
                },
            },
            { $match: query },
            { $sort: { [sort]: order } },
        ]).collation({ locale: "en", strength: 2 });

        datesObj
            // .skip(skip)
            // .limit(per_page)
            // .sort({ [sort]: order })
            .exec((err, datesData) => {
                if (!err) {
                    let cityData = [];
                    let stateData = [];
                    let countryData = [];
                    datesData.find((date) => {
                        if (date.location === userDetails.location) {
                            cityData.push(date);
                        } else if (date.province === userDetails.province) {
                            stateData.push(date);
                        } else {
                            countryData.push(date);
                        }
                    });
                    const filterDatesData = [...cityData, ...stateData, ...countryData];
                    const dates = paginate(filterDatesData, per_page, current_page);
                    return res.status(200).json(
                        helper.successResponse(
                            {
                                // dates: dates.map(date => date.created_at),
                                dates,
                                pagination: {
                                    current_page,
                                    per_page,
                                    total_dates,
                                    total_pages,
                                },
                            },
                            200,
                            "All dates fetched successfully !"
                        )
                    );
                }
                return res
                    .status(400)
                    .json(helper.errorResponse(err, 400, "Something went wrong while fetching."));
            });
    } catch (err) {
        console.log("err catched", err);
        return res.status(500).json(helper.errorResponse(err, 500, "Something went wrong."));
    }
};

function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
}

/**
 * Get draft date
 * Only post can be in draft.
 * date_status label is uesed to do this. By default it's false, means draft.
 */
exports.getDraftDate = async (req, res) => {
    try {
        const dateInDraft = await Dates.findOne({
            date_status: false,
            user_name: req.datajwt.userdata.user_name,
        });
        if (dateInDraft) {
            return res
                .status(200)
                .json(helper.successResponse(dateInDraft, 200, "Date fetched successfully!"));
        } else {
            return res
                .status(404)
                .json(helper.successResponse(dateInDraft, 200, "Date not found!"));
        }
    } catch (error) {
        return res
            .status(400)
            .json(helper.errorResponse({ error: error.message }, 400, "Failed to fetch date"));
    }
};

/**
 * Create date
 * 1. First check if any post is in draft if yes then not allowed to created new date
 * 2. If no draft found then created new date.
 */
exports.date = async (req, res) => {
    try {
        const { isUpdate = false } = req.body;

        console.log("date creation started");

        if (!isUpdate) {
            const dateInDraft = await Dates.findOne({
                date_status: false,
                user_name: req.datajwt.userdata.user_name,
            });

            if (dateInDraft) {
                return res
                    .status(403)
                    .json(
                        helper.errorResponse(
                            { error: "You already have a date in draft." },
                            403,
                            "You already have a date in draft."
                        )
                    );
            }
        }

        const dateObj = new Dates({
            ...req.body,
            ...(isUpdate && { is_new: true }),
            updated_at: new Date(),
        });

        const success = await dateObj.save();

        if (success) {
            const success_message =
                isUpdate == "true" || isUpdate == true
                    ? "Date updated successfully!"
                    : "Date created successfully!";
            return res.status(201).json(helper.successResponse(success, 201, success_message));
        } else {
            return res
                .status(500)
                .json(
                    helper.errorResponse(
                        { error: "Failed to create date. Refresh the page and retry." },
                        500,
                        "Failed to create date. Refresh the page and retry."
                    )
                );
        }
    } catch (error) {
        return res
            .status(400)
            .json(helper.errorResponse({ error: error.message }, 400, "Failed to create date"));
    }
};

/**
 * Update date
 */
exports.updateDate = async (req, res) => {
    try {
        const update = req.body;

        Dates.findOneAndUpdate(
            { _id: mongoose.Types.ObjectId(update.date_id) },
            {
                ...update,
                // is_new: false,
                updated_at: new Date(),
            },
            { new: true },
            (err, doc) => {
                if (err) {
                    return res
                        .status(400)
                        .json(helper.errorResponse({ error: err }, 400, "Failed to update date"));
                }
                return res
                    .status(200)
                    .json(
                        helper.successResponse(
                            { date: helper.dateResponse(doc) },
                            201,
                            "Date updated successfully!"
                        )
                    );
            }
        );
    } catch (error) {
        res.status(400).json(
            helper.errorResponse({ error: error.message }, 400, "Failed to update date")
        );
    }
};

/**
 * Delete draft date if exists.
 */
exports.deleteDate = async (req, res) => {
    try {
        const dateInDraft = await Dates.findOne({
            date_status: false,
            user_name: req.datajwt.userdata.user_name,
        });

        if (dateInDraft) {
            let success = await dateInDraft.delete();

            if (success) {
                return res
                    .status(200)
                    .json(helper.successResponse(success, 200, "Date deleted successfully!"));
            } else {
                return res
                    .status(500)
                    .json(
                        helper.errorResponse(
                            { error: "Failed to create date. Refresh the page and retry." },
                            500,
                            "Failed to create date. Refresh the page and retry."
                        )
                    );
            }
        } else {
            return res.status(200).json(helper.successResponse([], 200, "Draft Date not found!"));
        }
    } catch (error) {
        return res
            .status(400)
            .json(helper.errorResponse({ error: error.message }, 400, "Failed to create date"));
    }
};

/**
 * delete Dates by date ids
 */
exports.deleteDateByIds = async (req, res) => {
    try {
        const { ids } = req.body;

        const datesDeleted = await Dates.deleteMany({
            _id: { $in: ids },
        });

        if (datesDeleted.deletedCount) {
            return res
                .status(200)
                .json(helper.successResponse(datesDeleted, 200, "Date deleted successfully!"));
        } else {
            return res.status(200).json(helper.successResponse([], 200, " Dates not found!"));
        }
    } catch (error) {
        return res
            .status(400)
            .json(helper.errorResponse({ error: error.message }, 400, "Failed to delete dates."));
    }
};

/**
 * Update draft date status
 */
exports.updateDraftStatus = async (req, res) => {
    try {
        const { date_status } = req.body;

        let { user_name, role } = req.datajwt.userdata;

        if (role == 2) {
            return res
                .status(400)
                .json(helper.errorResponse(error, 400, "Admin can not update draft date."));
        }

        const dateInDraft = await Dates.findOne({ date_status: false, user_name: user_name });

        if (dateInDraft) {
            dateInDraft.date_status = date_status;
            // dateInDraft.is_new = false;
            dateInDraft.updated_at = new Date();
            dateInDraft.save();
            return res
                .status(200)
                .json(helper.successResponse(dateInDraft, 200, "Date fetched successfully!"));
        }

        return res
            .status(404)
            .json(helper.successResponse(dateInDraft, 200, "Draft date not found!"));
    } catch (error) {
        res.status(400).json(
            helper.errorResponse({ error: error.message }, 400, "Failed to update date")
        );
    }
};

/**
 * @param req
 * @param res
 * Update date status as 1 : Pending, 2: Verified, 3 Block ( deactivated ), 4: Delete ( soft ), 6: Warned 7: Re Submitted
 */
exports.updateStatus = async (req, res) => {
    try {
        const loginUserId = req.datajwt.userdata._id; //admin ID
        const { status, ids } = req.body;

        Dates.updateMany(
            { _id: { $in: ids } },
            {
                $set: {
                    status: +status,
                    // is_new: false,
                    is_blocked_by_admin: 1,
                    blocked_date: new Date(),
                },
                updated_at: new Date(),
            },
            (error, result) => {
                console.log(result);
                if (error) {
                    return res
                        .status(400)
                        .json(helper.errorResponse(error, 400, "Failed to update date status"));
                }
                if (result.n === 1) {
                    ChatRoom.updateMany(
                        { date_id: { $in: ids } },
                        {
                            $set: { status: 2, blocked_by: loginUserId, is_blocked_by_admin: 1 },
                            updated_at: new Date(),
                        },
                        (error, result) => {
                            if (error) {
                                return res
                                    .status(400)
                                    .json(
                                        helper.errorResponse(
                                            error,
                                            400,
                                            "Failed to update date associated chatrooms status"
                                        )
                                    );
                            }
                            return res
                                .status(200)
                                .json(
                                    helper.successResponse(
                                        [],
                                        201,
                                        "Date status updated successfully!"
                                    )
                                );
                        }
                    );
                } else {
                    return res
                        .status(200)
                        .json(helper.successResponse([], 201, "Date status updated successfully!"));
                }
                return res
                    .status(200)
                    .json(helper.successResponse([], 201, "Date status updated successfully!"));
            }
        );
    } catch (error) {
        return res.status(500).json(helper.errorResponse(error, 500, error));
    }
};

exports.getStats = async (req, res) => {
    let stats = {
        total_dates: 0,
        verified_dates: 0,
        pending_dates: 0,
        deactivated_dates: 0,
        new_dates: 0,
        warned_dates: 0,
        re_submitted_dates: 0,
    };
    try {
        const totalDates = await Dates.countDocuments({
            status: { $nin: [3, 6] },
            date_status: true,
        });

        const pendingDates = await Dates.aggregate([
            { $match: { date_status: false } },
            { $count: "pending_dates" },
        ]);

        const verifiedDates = await Dates.aggregate([
            { $match: { date_status: true } },
            { $count: "verified_dates" },
        ]);

        const deactivatedDates = await Dates.aggregate([
            { $match: { status: 3 } },
            { $count: "deactivated_dates" },
        ]);

        const newDates = await Dates.aggregate([
            { $match: { is_new: true, date_status: true } },
            { $count: "new_dates" },
        ]);

        const warnedDates = await Dates.aggregate([
            { $match: { status: 6 } },
            { $count: "warned_dates" },
        ]);

        const reSubmittedDates = await Dates.aggregate([
            { $match: { status: 7 } },
            { $count: "re_submitted_dates" },
        ]);

        if (totalDates) {
            stats.total_dates = totalDates;
        }

        if (verifiedDates.length) {
            stats.verified_dates = verifiedDates[0].verified_dates;
        }

        if (pendingDates.length) {
            stats.pending_dates = pendingDates[0].pending_dates;
        }

        if (deactivatedDates.length) {
            stats.deactivated_dates = deactivatedDates[0].deactivated_dates;
        }

        if (newDates.length) {
            stats.new_dates = newDates[0].new_dates;
        }

        if (warnedDates.length) {
            stats.warned_dates = warnedDates[0].warned_dates;
        }

        if (reSubmittedDates.length) {
            stats.re_submitted_dates = reSubmittedDates[0].re_submitted_dates;
        }

        res.status(200).json(helper.successResponse(stats, 200, "Posts ( Dates ) stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse(error, 500, error));
    }
};

// Make is new false
exports.seenDatesByIds = async (req, res) => {
    try {
        const { ids } = req.body;

        const datesUpdated = await Dates.updateMany({ _id: { $in: ids } }, { is_new: false });

        if (datesUpdated) {
            return res
                .status(200)
                .json(helper.successResponse(datesUpdated, 200, "Date updated successfully!"));
        } else {
            return res.status(200).json(helper.successResponse([], 200, "Dates not found!"));
        }
    } catch (error) {
        return res
            .status(400)
            .json(helper.errorResponse({ error: error.message }, 400, "Failed to delete dates."));
    }
};
