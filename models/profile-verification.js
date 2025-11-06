/*
* Schema for profile_verification table
*/
const mongoose = require('mongoose');
const moment = require('moment-timezone')
const { Schema } = mongoose;

const ProfileVerificationSchema = new Schema({
  username_id: { type: String, required: true, unique: true },
  verification_docs: { type: String },
  verified:  { type: Boolean, default: false },
//  created_at: { type: Date, default: Date.now },
created_at: {
    type: String,
    default:()  => moment().tz('America/Toronto').toDate().format()
  },   
 updated_at: { type: Date },
});

const profile_verification = mongoose.model('profile_verification', ProfileVerificationSchema);

module.exports = profile_verification;
