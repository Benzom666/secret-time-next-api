/*
* Schema for notification table
*/
const mongoose = require('mongoose');

const { Schema } = mongoose;

const NotificationSchema = new Schema({

  // user_id: { type: Schema.Types.ObjectId, ref: 'User' },
  user_email: { type: String },
  title: { type: String },
  message: { type: String },

  sent_time: { type: Date, default: Date.now },
  read_date_time: { type: Date },

  type : { type: String }, // check default-messages in seeder
  status: { type: Number, default: 0 }, // 0 : Un read, 1 :  read
  deleted_date: { type: Date, default: null },
  created_date: { type: Date, default: Date.now },
  update_date : { type: Date, default: Date.now },

});


const notification = mongoose.model('notification', NotificationSchema);
module.exports = notification;
