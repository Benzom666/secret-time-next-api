/*
* Schema for requests table
*/
const mongoose = require('mongoose');

const { Schema } = mongoose;

const RequestsSchema = new Schema({
  requester_id: { type: String },
  receiver_id: { type: String }, // Female profile id
  // date_created_id: { type: String }, // Female profile id
  date_id : { type: String },
  status: { type: Number, default: 0 },
  // 0: pending ( sent to female)
  // 1: accepted ( sent to female)
  // 2: rejected ( reported )
  message: { type: String },
  deleted_date: { type: Date },
  created_date: { type: Date, default: Date.now },
  update_date : { type: Date, default: Date.now },
});

const requests = mongoose.model('requests', RequestsSchema);

module.exports = requests;
