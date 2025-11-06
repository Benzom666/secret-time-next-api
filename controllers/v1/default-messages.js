/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const ejs = require('ejs');
const defaultMessages = require('../../models/default-messages');
const User = require('../../models/user');
const Dates = require('../../models/dates');
const { sendMail, totalUnreadCount, notificationList } = require('./notification')

const helper = require('../../helpers/helper');
const mails = require('../../helpers/mails');
const chatController = require('./chat');


exports.getAllMessages = async (req, res) => {
  let {
    messageType = 'userRequestType',
  } = req.query;

  try {


    let fields = {
      _id: 0,
      __v: 0,
      created_at: 0,
      // updated_at: 0,
      // photos: 0,
      // photosTagline: 0,
      // tagline:0,
      // photosDescription: 0,
      // taglineAndDesc: 0,
      // photosTaglineDescription: 0,
      // description: 0,
        // [messageType]: 1

    };

    let messages;


    if(messageType == 'userRequestType') {

      messages = await defaultMessages.find({},  {
        _id: 0,
        __v: 0,
        created_at: 0,
        postMessage: 0,
      }).exec();

    } else {
      messages = await defaultMessages.find({}, {
        _id: 0,
       [messageType]: 1
      }).exec();

    }

    return res.status(201).json(helper.successResponse(messages, 201, 'Default messages list'));
  } catch (err) {
    console.log(err)
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
};

exports.requestMessage = async (req, res) => {
 try {
    let {
      user_email_list = null,
      message_id = 0,
      messageType = 'image',
      post_ids = null,
      type = 'verified'
    } = req.body;

    let query = {
      [messageType] : 1
    };

    if(post_ids  == null && messageType === 'postMessage') {
      res.status(400).json(helper.errorResponse([], 400, 'Minimum one post id is required.'));
    }
    if(!user_email_list ) {
      res.status(400).json(helper.errorResponse([], 400, 'Minimum one email is required.'));
    }
    // Message list
    const messageList = await defaultMessages.findOne({}, query).exec();

    if(!messageList) {
      return res.status(500).json(helper.errorResponse([], 500, 'No message found.Please contact admin.'));
    }


    // we need array always
    if(!Array.isArray(user_email_list)){
        user_email_list = user_email_list.split();
    }


    // update user table to track that request change fired
    await User.updateMany({email : { $in: user_email_list }}, {
      request_change_fired: true,
      requested_date: new Date()
    });

    user_email_list.map(async email => {
      const count = await totalUnreadCount(email);
      const list = await notificationList(email)

      chatController.pushNotification(req, { receiverEmail: email, count : count, notifications: list })
    })


   console.log('messageList', messageList);
    // Message to send to user/s
    const message = messageList[messageType][message_id];
    console.log('messageList', message);

    if(!message) {
      return res.status(500).json(helper.errorResponse([], 500, `${messageType} message not sent successfully.Check message type and message id.`));
    }

    if(messageType === 'postMessage') {
      const dateModified = await Dates.updateMany({ _id : { $in : post_ids } }, {
        status: 6,
        is_new: false,
        warning_sent_date: new Date(),
      });
    }

    // if(messageType == 'taglineAndDesc') {
    //   // update user profile as change request sent so profile became pending.
    //   const usersModified = await User.updateMany({ email : { $in : user_email_list } }, {
    //     image_verified: false,
    //     tag_desc_verified: false,
    //   });
    // }
  
    let mail;
    let emailData = {
      message: message,
      loginUrl: process.env.FRONTEND_URL,
      type: messageType
    };
    for (const email of user_email_list) {
    // await user_email_list.forEach(async (email) => {
      emailData.emailList= [email];
      let userDetail = await User.findOne({email});
      console.log(userDetail)
      emailData.userName= userDetail.user_name;
      
      if(userDetail.status != '1') {
        emailData.mailTemplate = 'views/mails/change-request-rejected.ejs';
        emailData.subject = "Change request rejected!!!";
      } else {
          emailData.mailTemplate = 'views/mails/access-denied.ejs';
          emailData.subject = "Access Denied!!!";
      }

      mail = await sendMail(emailData);
      console.log('Mail error', mail)
      if(mail.error) {
        return res.status(500).json(helper.errorResponse([], 500, mail.message));
      }
    }
    return res.status(200).json(helper.successResponse(emailData, 200, `Request change notification sent to users`));
 } catch ( err ) {
    console.log(err)
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
 }
}