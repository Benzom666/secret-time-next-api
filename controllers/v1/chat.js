const { response } = require("express");
const { find } = require("lodash");
const helper = require("../../helpers/helper");
const chatRoom = require("../../models/chat_room");
const user = require("../../models/user");
const chat = require("../../models/chat");
const date = require("../../models/dates");
const _ = require("lodash");

var currentSocket = [];

exports.SocketInit = async (socket, user) => {
    currentSocket[user.user?._id] = { socket, user: user.user };
    // on message sent, make it dynamic, for security
    let messageLsnr = `send-${user.user?.user_name}`;
    let readedChat = `recieve-${user.user?._id}`;

    /**
     * event should be called from frontend to send message
     * @param  recieverId
     * @param message
     * @param chatRoomId
     */
    socket.on("sendMessage", (message) => {
        console.log(message);

        // store on db
        chat.create(
            {
                sender_id: user.user._id,
                receiver_id: message.recieverId,
                sent_time: new Date(),
                message: message.message,
                room_id: message.chatRoomId,
            },
            (err, chat) => {
                if (!err) {
                    console.log("here we got the data", "recieve-" + message.recieverId, chat);
                    socket.broadcast.emit("recieve-" + message.recieverId, chat); // will pass the message to other receivers
                } else {
                    console.log(err.message);
                }
            }
        );
    });

    /**
     * event should be called whenever socket connection would be breaked
     */
    socket.on("disconnect", () => {
        console.log("SOCKET SEVER DISCONNECT");
    });

    /**
     * this event should be called by reciever side to confirm that messages has been readed
     * @param recieverId
     * @param senderId
     * @param chatId
     */

    socket.on("readMessage", (data) => {
        let { recieverId, senderId, chatId } = data;
        if (chatId.length > 0 && recieverId != undefined && senderId != undefined) {
            chat.updateMany(
                { _id: { $in: chatId }, receiver_id: recieverId, read_date_time: null },
                { read_date_time: new Date() },
                (err, data) => {
                    if (!err) {
                        console.log("here we got thedata ");
                        socket.broadcast.emit("readed-" + senderId, {
                            id: chatId,
                            recieverId: recieverId,
                        }); // will pass the message to other receviers
                    }
                }
            );
        } else {
            console.log("data incomplete");
        }
    });

    /**
     * this event should be called by sender side to delete the message
     * @param recieverId
     * @param senderId
     * @param chatId
     */

    socket.on("deleteMessage", (data) => {
        let { recieverId, senderId, chatId } = data;
        if (chatId.length > 0 && recieverId != undefined && senderId != undefined) {
            chat.findOneAndDelete({ _id: { $in: chatId }, senderId: senderId }, (err, data) => {
                if (!err) {
                    console.log("here we got thedata ");
                    socket.broadcast.emit("deleted-" + recieverId, {
                        id: chatId,
                        senderId: senderId,
                    }); // will pass the message to other receviers
                }
            });
        } else {
            console.log("data incomplete");
        }
    });
};

exports.createRequest = (req, res, next) => {
    let { recieverId, message, dateId } = req.body;
    let { userdata } = req.datajwt;
    try {
        chatRoom.find(
            { users: { $all: [userdata._id, recieverId] }, date_id: dateId },
            (err, cr) => {
                if (err) {
                    return res.status(500).json(helper.errorResponse([], 500, err.message));
                }
                cr = cr[0];
                if (!cr) {
                    chatRoom.create(
                        {
                            users: [userdata._id, recieverId],
                            status: 0,
                            date_id: dateId,
                            isSuperInterested: req.body.isSuperInterested,
                        },
                        (err, cr) => {
                            if (!err) {
                                if (currentSocket[userdata._id]) {
                                    currentSocket[userdata._id].socket.broadcast.emit(
                                        "request-" + recieverId,
                                        cr
                                    );
                                }
                                chat.create(
                                    {
                                        sender_id: userdata._id,
                                        receiver_id: recieverId,
                                        sent_time: new Date(),
                                        message: message,
                                        room_id: cr._id,
                                    },
                                    (err, chat) => {
                                        if (!err) {
                                            if (currentSocket[userdata._id]) {
                                                currentSocket[userdata._id].socket.broadcast.emit(
                                                    "recieve-" + recieverId,
                                                    chat
                                                ); // will pass the message to other receviers
                                            }

                                            // update current date with flag alreadyMessage = true
                                            // this will be used to hide the message button on frontend.
                                        } else {
                                            console.log(err.message);
                                        }
                                    }
                                );
                                return res.status(200).json(
                                    helper.successResponse(
                                        {
                                            chatRoom: cr,
                                        },
                                        200,
                                        "Chat room created successfully !"
                                    )
                                );
                            } else {
                                return res
                                    .status(400)
                                    .json(helper.errorResponse([], 400, err.message));
                            }
                        }
                    );
                } else {
                    return res.status(200).json(
                        helper.successResponse(
                            {
                                chatRoom: cr,
                            },
                            200,
                            "Room already exist !"
                        )
                    );
                }
            }
        );
    } catch (err) {
        return res.status(500).json(helper.errorResponse(err, 500, "Something went wrong."));
    }
};

exports.acceptRequest = (req, res, next) => {
    try {
        let { chatRoomId, senderId } = req.body;
        let { userdata } = req.datajwt;
        if (userdata.gender == "female") {
            chatRoom.findOne(
                { _id: chatRoomId, users: { $in: userdata._id }, status: 0 },
                (err, chatR) => {
                    if (!err && chatR != null) {
                        chatRoom.updateOne(
                            { _id: chatRoomId, users: { $in: userdata._id }, status: 0 },
                            { status: 1 },
                            (err, data) => {
                                if (!err && data.n == 1) {
                                    if (currentSocket[userdata._id]) {
                                        chatR.status = 1;
                                        currentSocket[userdata._id].socket.broadcast.emit(
                                            "requestAccept-" + senderId,
                                            chatR
                                        );
                                    }
                                    chatR.status = 1;
                                    return res.status(200).json(
                                        helper.successResponse(
                                            {
                                                chatRoom: chatR,
                                            },
                                            200,
                                            "Accepted!!"
                                        )
                                    );
                                } else {
                                    return res
                                        .status(400)
                                        .json(
                                            helper.errorResponse("", 400, "failed to update status")
                                        );
                                }
                            }
                        );
                    } else {
                        return res.status(404).json(
                            helper.successResponse(
                                {
                                    chatRoom: "",
                                },
                                404,
                                "Requested chat room not found!"
                            )
                        );
                    }
                }
            );
        } else {
            return res
                .status(401)
                .json(helper.errorResponse({}, 401, "You are not Authorized for this request."));
        }
    } catch (err) {
        return res
            .status(500)
            .json(helper.errorResponse(err.message, 500, "Something went wrong."));
    }
};

/*
exports.chatRoomList = async ( req, res, next )=>{
    try{
        let {userdata} = req.datajwt;
        let dataToSend=[];
        await chatRoom.find({ "users": { "$in": userdata._id } }).populate('users').populate('date_id').populate('blocked_by')
            .exec(async (err, List) => {

            if (!List.length) {
                return res.status(200).json(helper.successResponse({ 'chatRooms': List }, 200, 'No chatroom.'));
            }

            List.forEach( async (room, key)=>{
                let chats = await chat.find({"room_id": room._id}).sort({created_date: -1}).exec();
                console.log("chat message", room);
                room.users.forEach((user, i)=>{
                    if(user._id != userdata._id){
                        // console.log("here", key)
                        dataToSend[key] = {
                                            user: helper.userResponse(user),
                                            status:  List[key].status,
                                            _id: List[key]._id,
                                            message: chats[0],
                                            date_id: List[key].date_id,
                                            blocked_by:List[key].blocked_by,
                                            created_date: List[key].created_date
                                            }
                    }
                });
                if(key+1 == List.length){
                    return res.status(200).json(helper.successResponse({
                        // 'chatRooms': dataToSend
                        'chatRooms': _.without(dataToSend, null)
                      }, 200, 'List fetched!'));
                }
            });

        });

    }catch(err){
        return res.status(500).json(helper.errorResponse(err.message, 500, 'Something went wrong.'));
    }
}
*/

exports.chatRoomList = async (req, res, next) => {
    try {
        let { userdata } = req.datajwt;
        let dataToSend = [];

        var populateQuery = [{ path: "users" }, { path: "date_id" }, { path: "blocked_by" }];
        // select:['_id','images','user_name']
        let chatRoomModel = await chatRoom
            .find({ users: { $in: userdata._id } })
            .populate(populateQuery)
            .lean();

        await Promise.all(
            chatRoomModel.map(async (chatRoom) => {
                try {
                    let otherUserName;
                    chatRoom.users.forEach((user) => {
                        if (user.user_name !== userdata.user_name) {
                            otherUserName = user;
                        }
                    });
                    let chats = await chat
                        .find({ room_id: chatRoom._id })
                        .sort({ created_date: -1 })
                        .exec();
                    let data = {
                        user: helper.userResponse(otherUserName),
                        status: chatRoom.status,
                        _id: chatRoom._id,
                        message: chats[0],
                        date_id: chatRoom.date_id,
                        blocked_by: chatRoom.blocked_by,
                        created_date: chatRoom.created_date,
                        isSuperInterested: chatRoom.isSuperInterested || false,
                    };
                    dataToSend.push(data);
                } catch (error) {
                    console.log("error" + error);
                }
            })
        );
        return res.status(200).json(
            helper.successResponse(
                {
                    chatRooms: dataToSend,
                    // 'chatRooms': _.without(dataToSend, null)
                },
                200,
                "List fetched!"
            )
        );
    } catch (err) {
        return res
            .status(500)
            .json(helper.errorResponse(err.message, 500, "Something went wrong."));
    }
};

exports.chatRoomHistory = async (req, res, next) => {
    try {
        let { chatRoomId } = req.query;
        let { userdata } = req.datajwt;
        await chatRoom.findOne(
            { _id: chatRoomId, users: { $in: userdata._id } },
            async (err, chatR) => {
                console.log(userdata, chatR, chatRoomId);
                if (chatR) {
                    await chat.find({ room_id: chatRoomId }, (err, chat) => {
                        if (!err) {
                            return res.status(200).json(
                                helper.successResponse(
                                    {
                                        chat: chat,
                                    },
                                    200,
                                    "chat fetched!"
                                )
                            );
                        } else {
                            return res.status(404).json(
                                helper.successResponse(
                                    {
                                        chatRoom: "",
                                    },
                                    404,
                                    "Requested chat room not found!"
                                )
                            );
                        }
                    });
                } else {
                    return res
                        .status(401)
                        .json(
                            helper.errorResponse(
                                {},
                                401,
                                "You are not Authorized for this request."
                            )
                        );
                }
            }
        );
    } catch (err) {
        return res
            .status(500)
            .json(helper.errorResponse(err.message, 500, "Something went wrong."));
    }
};

/**
 * this function called to block user from user model and from all chat rooms
 * @param req.body
 */
exports.blockRequest = async (req, res, next) => {
    try {
        let { chatRoomId, recieverId } = req.body;
        let { userdata } = req.datajwt;

        chatRoom.findOne(
            { _id: chatRoomId, users: { $in: userdata._id }, status: 1 },
            (err, chatR) => {
                if (!err && chatR != null) {
                    chatRoom.updateOne(
                        { _id: chatRoomId, users: { $in: userdata._id }, status: 1 },
                        { status: 2, blocked_by: userdata._id },
                        (err, data) => {
                            console.log("this is data", data);
                            if (!err && data.n == 1) {
                                if (currentSocket[userdata._id]) {
                                    chatR.status = 2;
                                    currentSocket[userdata._id].socket.broadcast.emit(
                                        "requestBlock-" + recieverId,
                                        chatR
                                    );
                                }
                                chatR.status = 2;
                                chatR.blocked_by = userdata._id;
                                updateBlockedUsersInUserModel(userdata, recieverId, (err, data) => {
                                    if (err) {
                                        return res
                                            .status(400)
                                            .json(
                                                helper.errorResponse(
                                                    "",
                                                    400,
                                                    "Something went wrong while doing complete user block",
                                                    err
                                                )
                                            );
                                    }
                                    findAndBlockOtherChatRooms(
                                        userdata._id,
                                        recieverId,
                                        (err, data) => {
                                            if (err) {
                                                return res
                                                    .status(400)
                                                    .json(
                                                        helper.errorResponse(
                                                            "",
                                                            400,
                                                            "Something went wrong while finding and blocking other ChatRooms",
                                                            err
                                                        )
                                                    );
                                            }
                                            return res
                                                .status(200)
                                                .json(
                                                    helper.successResponse(
                                                        { chatRoom: chatR },
                                                        200,
                                                        "Accepted!!"
                                                    )
                                                );
                                        }
                                    );
                                });
                            } else {
                                return res
                                    .status(400)
                                    .json(helper.errorResponse("", 400, "failed to update status"));
                            }
                        }
                    );
                } else {
                    return res.status(404).json(
                        helper.successResponse(
                            {
                                chatRoom: "",
                            },
                            404,
                            "Requested chat room not found!"
                        )
                    );
                }
            }
        );
    } catch (err) {
        return res
            .status(500)
            .json(helper.errorResponse(err.message, 500, "Something went wrong."));
    }
};

/**
 * this callback function used to find and block all the chat rooms of the given user
 * @param loginUserId
 * @param recieverId
 */
const findAndBlockOtherChatRooms = (loginUserId, recieverId, callback) => {
    chatRoom.find(
        {
            $and: [
                { users: { $in: [loginUserId] } },
                { users: { $in: [recieverId] } },
                { status: 1 },
            ],
        },
        (err, data) => {
            if (err) {
                // console.log(`Something went wrong while finding other chat room to block for this user ${loginUserId}`, err);
                callback(err, null);
            }
            if (data.length > 0) {
                let chatRoomIds = data.map((value) => {
                    return value._id.toString();
                });
                chatRoom.updateMany(
                    { _id: { $in: chatRoomIds }, users: { $in: loginUserId }, status: 1 },
                    { $set: { status: 2, blocked_by: loginUserId } },
                    { multi: true },
                    (err, res) => {
                        if (err) {
                            // console.log(`Something went wrong while updating following chat room ${chatRoomIds} to block for this user ${loginUserId}`, err);
                            callback(err, null);
                        }
                        console.log(
                            `Following chat rooms ${chatRoomIds} blocked successfully for this user ${loginUserId}`,
                            res
                        );
                        callback(null, data);
                    }
                );
            }
            console.log(`No chat rooms found for this user ${loginUserId}`);
            callback(null, data);
        }
    );
};

/**
 * this callback function used to block the user to see any dates of the blocked user
 * @param loginUserId
 * @param recieverId
 */
const updateBlockedUsersInUserModel = ({ _id, user_name }, recieverId, callback) => {
    user.findByIdAndUpdate(
        recieverId,
        { $push: { blocked_by_others: { $each: [user_name] } } },
        (err, result) => {
            if (err) {
                callback(err, null);
            }
            user.findByIdAndUpdate(
                _id,
                { $push: { blocked_users_by_self: { $each: [result.user_name] } } },
                (err, result) => {
                    if (err) {
                        callback(err, null);
                    }
                    callback(null, result);
                }
            );
        }
    );
};

/**
 * this function called to unblock user from user model and from all chat rooms
 * @param req.body
 */
exports.unBlockRequest = async (req, res) => {
    try {
        let { chatRoomId, recieverId } = req.body;
        let { userdata } = req.datajwt;

        chatRoom.findOne(
            { _id: chatRoomId, users: { $in: userdata._id }, status: 2 },
            (err, chatR) => {
                if (!err && chatR != null) {
                    chatR.blocked_by = undefined;
                    chatRoom.updateOne(
                        { _id: chatRoomId, users: { $in: userdata._id }, status: 2 },
                        { $unset: { blocked_by: 1 }, status: 1 },
                        (err, data) => {
                            console.log("this is data", data);
                            if (!err && data.n == 1) {
                                if (currentSocket[userdata._id]) {
                                    chatR.status = 1;
                                    currentSocket[userdata._id].socket.broadcast.emit(
                                        "requestBlock-" + recieverId,
                                        chatR
                                    );
                                }
                                chatR.status = 1;
                                updateUnBlockedUsersInUserModel(
                                    userdata,
                                    recieverId,
                                    (err, data) => {
                                        if (err) {
                                            return res
                                                .status(400)
                                                .json(
                                                    helper.errorResponse(
                                                        "",
                                                        400,
                                                        "Something went wrong while doing complete user block",
                                                        err
                                                    )
                                                );
                                        }
                                        findAndUnBlockOtherChatRooms(
                                            userdata._id,
                                            recieverId,
                                            (err, data) => {
                                                if (err) {
                                                    return res
                                                        .status(400)
                                                        .json(
                                                            helper.errorResponse(
                                                                "",
                                                                400,
                                                                "Something went wrong while finding and blocking other ChatRooms",
                                                                err
                                                            )
                                                        );
                                                }
                                                return res
                                                    .status(200)
                                                    .json(
                                                        helper.successResponse(
                                                            { chatRoom: chatR },
                                                            200,
                                                            "Accepted!!"
                                                        )
                                                    );
                                            }
                                        );
                                    }
                                );
                            } else {
                                return res
                                    .status(400)
                                    .json(helper.errorResponse("", 400, "failed to update status"));
                            }
                        }
                    );
                } else {
                    return res.status(404).json(
                        helper.successResponse(
                            {
                                chatRoom: "",
                            },
                            404,
                            "Requested chat room not found!"
                        )
                    );
                }
            }
        );
    } catch (err) {
        return res
            .status(500)
            .json(helper.errorResponse(err.message, 500, "Something went wrong."));
    }
};

/**
 * this callback function used to unblock the user to see any dates of the blocked user
 * @param Object
 * @param recieverId
 */
const updateUnBlockedUsersInUserModel = ({ _id, user_name }, recieverId, callback) => {
    user.findByIdAndUpdate(
        recieverId,
        { $pullAll: { blocked_by_others: [user_name] } },
        (err, result) => {
            if (err) {
                callback(err, null);
            }
            user.findByIdAndUpdate(
                _id,
                { $pullAll: { blocked_users_by_self: [result.user_name] } },
                (err, result) => {
                    if (err) {
                        callback(err, null);
                    }
                    callback(null, result);
                }
            );
        }
    );
};

/**
 * this callback function used to find and unblock all the chat rooms of the given user
 * @param loginUserId
 * @param recieverId
 */
const findAndUnBlockOtherChatRooms = (loginUserId, recieverId, callback) => {
    chatRoom.find(
        {
            $and: [
                { users: { $in: [loginUserId] } },
                { users: { $in: [recieverId] } },
                { is_blocked_by_admin: { $ne: 1 } },
                { status: 2 },
            ],
        },
        (err, data) => {
            if (err) {
                // console.log(`Something went wrong while finding other chat room to block for this user ${loginUserId}`, err);
                callback(err, null);
            }
            if (data.length > 0) {
                let chatRoomIds = data.map((value) => {
                    return value._id.toString();
                });
                chatRoom.updateMany(
                    {
                        _id: { $in: chatRoomIds },
                        is_blocked_by_admin: { $ne: 1 },
                        users: { $in: loginUserId },
                        status: 2,
                    },
                    { $unset: { blocked_by: 1 }, status: 1 },
                    { multi: true },
                    (err, res) => {
                        if (err) {
                            // console.log(`Something went wrong while updating following chat room ${chatRoomIds} to block for this user ${loginUserId}`, err);
                            callback(err, null);
                        }
                        console.log(
                            `Following chat rooms ${chatRoomIds} blocked successfully for this user ${loginUserId}`,
                            res
                        );
                        callback(null, data);
                    }
                );
            }
            console.log(`No chat rooms found for this user ${loginUserId}`);
            callback(null, data);
        }
    );
};

/**
 * Handle cron
 */
exports.handleCron = async () => {
    console.log("CRON TRIGGERED");

    chat.find({ read_date_time: null, mail_notified: { $in: [0, null] } })
        .populate("receiver_id")
        .populate("sender_id")
        .populate("room_id")
        .exec((err, data) => {
            if (!err && data.length > 0) {
                let email = [];

                data.forEach((data, i) => {
                    email[i] = {
                        to: data?.receiver_id?.email,
                        sender: data?.sender_id?.email,
                        senderUserName: data?.sender_id?.user_name,
                        dateId: data?.room_id?.date_id,
                        message: data?.message,
                    };

                    chat.updateOne({ _id: data._id }, { mail_notified: 1 }, (err, data) => {
                        if (!err) {
                            console.log("mail data updated", data, data._id);
                        } else {
                            console.log(err);
                        }
                    });
                });

                let mailData = _.uniqBy(email, "to");
                let dataDateType;
                mailData.forEach(async (data) => {
                    dataDateType = await date.findOne({ _id: data.dateId });
                    let { standard_class_date, middle_class_dates, executive_class_dates, price } =
                        dataDateType;
                    let dateType = middle_class_dates
                        ? middle_class_dates
                        : standard_class_date
                        ? standard_class_date
                        : executive_class_dates;

                    const emailData = {
                        to: data.to,
                        sender: data.sender,
                        userName: data.senderUserName,
                        host: process.env.FRONTEND_URL
                            ? process.env.FRONTEND_URL
                            : "http://localhost:3000",
                        template: "views/mails/unread-message-send-email.ejs",
                        message: data.message.substring(0, 25) + "...",
                        dateTypeWithPrice: `"${dateType}-$${price}"`,
                        subject: "New Message",
                    };
                    const mailResponse = helper.sendEmailNewSignup(emailData);
                });
            }
        });
};

exports.chatClear = async (req, res) => {
    try {
        let { chatRoomId, recieverId } = req.body;
        let { userdata } = req.datajwt;
        chatRoom.findOne({ _id: chatRoomId, users: { $in: userdata._id } }, (err, chatR) => {
            if (!err && chatR != null) {
                chat.deleteMany({ room_id: chatRoomId }, function () {
                    console.log("chatRoom: ", chatRoomId, ": Chat Deleted");
                    currentSocket[userdata._id]?.socket.broadcast.emit(
                        "chatRoomCleared-" + recieverId,
                        { deleted: true }
                    );
                    return res.status(200).json(
                        helper.successResponse(
                            {
                                chat: "chat deleted",
                            },
                            200,
                            "chat deleted!"
                        )
                    );
                }).catch(function (err) {
                    console.log(err);
                });
            } else {
                return res.status(400).json(helper.errorResponse("", 400, "failed to clear chat"));
            }
        });
    } catch (err) {
        return res
            .status(500)
            .json(helper.errorResponse(err.message, 500, "Something went wrong."));
    }
};

exports.chatRoomExists = async (req, res) => {
    let { recieverId, dateId } = req.query;
    let { userdata } = req.datajwt;

    try {
        chatRoom.find(
            { users: { $all: [userdata._id, recieverId] }, date_id: dateId },
            (err, cr) => {
                if (err) {
                    return res.status(500).json(helper.errorResponse([], 500, err.message));
                }

                cr = cr[0];

                // room exists
                if (cr) {
                    return res
                        .status(200)
                        .json(helper.successResponse({ chatRoom: cr }, 200, true));
                }

                return res.status(200).json(helper.successResponse({ chatRoom: cr }, 200, false));
            }
        );
    } catch (err) {
        return res.status(500).json(helper.errorResponse(err, 500, "Something went wrong."));
    }
};

/**
 * Notification sender to web
 */
exports.pushNotification = (req, data) => {
    let { userdata } = req.datajwt;

    console.log("PUSH NOTIFICATION FIRED", data.receiverEmail);

    try {
        currentSocket[userdata._id]?.socket.broadcast.emit(
            `push-notification-${data.receiverEmail}`,
            data
        );
    } catch (err) {
        console.log("ERROR WHILE SENDING NOTIFICATION", err);
        // return false; // die silently for now
    }
};
