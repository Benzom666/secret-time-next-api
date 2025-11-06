/*
* Schema for chat table
*/
const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChatSchema = new Schema({

  sender_id: { type: Schema.Types.ObjectId, ref: 'User' },
  receiver_id: { type: Schema.Types.ObjectId, ref: 'User' },
  read_date_time: { type: Date },
  mail_notified: { type: Number, default : 0 },
  message: { type: String },

  sent_time: { type: Date, default: Date.now },

  room_id: { type: Schema.Types.ObjectId, ref: 'chatRoom' }, // From chat_room schema

  deleted_date: { type: Date },
  created_date: { type: Date, default: Date.now },
  update_date : { type: Date, default: Date.now },

});

const chat = mongoose.model('chat', ChatSchema);

module.exports = chat;
