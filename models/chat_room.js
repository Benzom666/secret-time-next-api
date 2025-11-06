/*
 * Schema for chat_room table
 */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const ChatRoomSchema = new Schema({
    users: [{ type: Schema.Types.ObjectId, ref: "User" }],
    name: { type: String }, // will be created dynamic
    status: { type: Number, default: 0 }, // YES : User blocked the male user, NO : mean no : status 0=pending, 1=accepted, 2=blocked
    blocked_by: { type: Schema.Types.ObjectId, ref: "User" },
    date_id: { type: Schema.Types.ObjectId, ref: "dates" },
    deleted_date: { type: Date },
    is_blocked_by_admin: { type: Number, default: 0 },
    created_date: { type: Date, default: Date.now },
    update_date: { type: Date, default: Date.now },
    isSuperInterested: { type: Boolean, default: false },
});

const chatRoom = mongoose.model("chatRoom", ChatRoomSchema);

module.exports = chatRoom;
