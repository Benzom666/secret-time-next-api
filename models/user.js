/* * Schema for user table */
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const { Schema } = mongoose;

const UserSchema = new Schema({
    user_name: { type: String, required: true, unique: true },
    gender: { type: String },
    first_name: { type: String },
    middle_name: { type: String },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    location: { type: String },
    country_code: { type: String },
    country: { type: String },
    province: { type: String },

    age: { type: Number, required: true },
    body_type: { type: String },
    ethnicity: { type: String },

    images: { type: Array, default: [] },

    un_verified_images: { type: Array, default: [] },
    image_verified: { type: Boolean, default: true }, // as first time i.e signup it's verified.

    selfie: { type: String, default: null },
    document: { type: String, default: null },

    documents_verified: { type: Boolean, default: false },

    tagline: { type: String },
    un_verified_tagline: { type: String },

    description: { type: String },
    un_verified_description: { type: String },

    tag_desc_verified: { type: Boolean, default: true },

    height: { type: String },
    max_education: { type: String },
    is_smoker: { type: String },
    occupation: { type: String },
    step_completed: { type: Number, required: true }, // last completed step
    profile_completed_date: { type: Date },
    reset_key: { type: String },
    // created_at: { type: Date, default: Date.now },
    created_at: {
        type: Date,
        default: () => moment().tz("America/Toronto").toDate(),
    },
    updated_at: { type: Date },

    email_verification_token: { type: String },
    email_verified: { type: Boolean, default: false },

    role: { type: Number, default: 1 }, // 1 : User , 2: Admin
    verified: { type: Boolean, default: false },

    status: { type: Number, default: 1 }, // 1: Pending, 2: Verified, 3 Block ( deactivated ), 4: Delete ( soft )

    before_last_logged_in: { type: Date }, // set the last_logged_in date in this field and update the last_logged_in by new login time to track the last to last login dateTime
    last_logged_in: { type: Date },
    active_user_count: { type: Number, default: 0 },
    new_user_count: { type: Number, default: 0 },
    deactivated_user_count: { type: Number, default: 0 },

    is_new: { type: Boolean, default: true }, // is profile is new

    verified_screen_shown: { type: Boolean, default: false }, // On frontend needed this to show verified screen
    request_change_fired: { type: Boolean, default: false },
    requested_date: { type: Date },

    blocked_users: { type: Array, default: [], unique: true }, // list of blocked users
    blocked_users_by_self: { type: Array, default: [], unique: true }, // list of blocked users by login user itself
    blocked_by_others: { type: Array, default: [], unique: true }, // list of other users who blocked login user

    date_warning_popup: { type: Boolean, default: false },
    image_warning_popup: { type: Boolean, default: false },

    categatoryName: String,
    categatoryId: { type: Schema.Types.ObjectId, ref: "categories" },
    aspirationName: String,
    aspirationId: { type: Schema.Types.ObjectId, ref: "aspirations" },
    first30DaysDateCreateTime: Date,
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
