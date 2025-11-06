/*
* Schema for DatesSchema table
*/
const mongoose = require('mongoose');

const { Schema } = mongoose;

const DatesSchema = new Schema({
  location: { type: String },
  country_code: { type: String },
  country: { type: String },
  province: { type: String },
  standard_class_date: { type: String },
  middle_class_dates:{ type: String },
  executive_class_dates:{ type: String },
  date_length: { type: String, },
  price:{ type: Number },
  date_details :{ type: String },
  user_name: { type: String, required: true },
  verification_docs: { type: String },
  // verified:  { type: Boolean, default: false },
  is_new: { type: Boolean, default: true },

  date_status: { type: Boolean, default: false }, // Draft by default. On payment it will be changed.
  status: { type: Number, default: 1 }, // 1 : Pending, 2: Verified, 3 Block ( deactivated ), 4: Delete ( soft ),
  // 5: to return new dates 6: to return warned dates 7: To return Re Submitted date. These will be sent in get date api only, check date listing api

  // warned: { type: Boolean, default: false },
  // re_submitted: { type: Boolean, default: false },
  warning_sent_date: { type: Date, default: null },
  is_blocked_by_admin: { type: Number , default: 0},
  blocked_date: { type: Date },

  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

DatesSchema.index({ location: -1 },   {
  collation: {
    locale: 'en',
    strength: 2
  }
}
);

const dates = mongoose.model('dates', DatesSchema);

module.exports = dates;
