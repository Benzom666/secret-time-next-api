/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const notification = require('../../models/notification');
const helper = require('../../helpers/helper');
const mails = require('../../helpers/mails');
const ejs = require('ejs');
const { CustomValidation } = require('express-validator/src/context-items');

exports.getAllNotification = async (req, res) => {
  let {
    current_page = 1,
    per_page = 10,
    sort = 'created_at',
    order = -1,
    status = '',
    type = '',
    user_email = '',
  } = req.query;

  current_page = parseInt(current_page);
  per_page = parseInt(per_page);

  let query = {
    deleted_date : { $eq : null },
    ...(status && status.length &&  { status: { $eq: status } } ),
    ...(type && type.length &&  { type: { $eq: type } } ),
    ...(user_email && user_email.length &&  { user_email: { $eq: user_email } } ),
  };

  console.log('query', query);
  try {

    let fields = { __v:  0  };
    if (current_page < 1) res.status(400).json(helper.errorResponse([], 400, 'Invalid page number, should start with 1.'));

    const skip = per_page * (current_page - 1);
    const total_notification = await notification.countDocuments(query);
    const total_pages = Math.ceil(total_notification / per_page);

    if(total_notification == 0) {
      return res.status(400).json(helper.errorResponse([], 400, 'No notification found.Refine your search.'));
    }

    if (current_page > total_pages) return res.status(400).json(helper.errorResponse([], 400, 'Invalid page number, can\'t be greater than total pages.'));

    notification.find(query)
    .skip(skip)
    .limit(per_page)
    .sort({ [sort]: order })
    .select(fields)
    .exec((err, notification) => {
      if (!err) {
        return res.status(200).json(helper.successResponse({
          notification,
          pagination: {
            current_page,
            per_page,
            total_notification,
            total_pages,
          },
        }, 200, 'All notification fetched successfully !'));
      }
      return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
    });

  } catch (err) {
    console.log(err);
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
};


exports.addNotification = async (req, res ) => {

    try {
        const newNotification = await createNotification(req.body);
        if(newNotification) {
          return res.status(200).json(helper.successResponse(newNotification, 201, 'Notification updated.'));
        }
        return res.status(400).json(helper.errorResponse('Not able to create notification.', 400, 'Something went wrong.'));
    }catch(err) {
        console.log(err);
        return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
    }
}

exports.update = async(req, res) => {
    try{
      const {
        id = null,
        name = '',
      } = req.query;

        notification.findOneAndUpdate({ _id: id }, { ...req.body, update_date: new Date() },  (err, notification) => {

          if (!notification) res.status(404).json(helper.errorResponse([], 404, 'No notification found by this id.'));

          return res.status(200).json(helper.successResponse([{message: 'Notification updated.' }], 200, 'Notification updated.'));
        });

    }catch(err) {
      return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
    }
}

exports.readAllNotification = async(req, res) => {
  try{
    const {
     email = null
    } = req.body;

      notification.updateMany({user_email: email},  { $set: {  status: 1 }}, (err, notification) =>{

        if (!notification) res.status(404).json(helper.errorResponse([], 404, 'Not able to modify status.'));

        return res.status(200).json(helper.successResponse([{message: 'Notification updated.' }], 200, 'Notification updated.'));

      })
  }catch(e) {
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
}

exports.delete = async(req, res) => {
    try{
      const {
        id = null
      } = req.body;

      notification.findOne({ _id: id }, (err, notification) => {

        if (!notification) res.status(404).json(helper.errorResponse([], 404, 'Notification not found'));

          notification.deleted_date = new Date();
          notification.save();

          return res.status(200).json(helper.successResponse([{message:'Notification deleted.' }], 200, 'Notification deleted.'));
        });

    }catch(err) {
      return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
    }
}

exports.getNotification = async ( req, res ) => {
  const { id } = req.params;
    notification.findById({_id : id}, {__v: 0}, (err, notification) => {
      if (!notification) res.status(404).json(helper.errorResponse([], 404, 'No notification found by this id.'));
      return res.status(200).json(helper.successResponse(notification, 200, 'Notification details.'));
    });
}

exports.deleteNotificationById = async (notificationId) => {
  try {
    notification.findOne({ _id: notificationId }, (err, notification) => {

      if (!notification)  return helper.errorResponse([], 404, 'Notification not found');
        notification.deleted_date = new Date();
      notification.save();
      console.log('notification', notification)
        return helper.successResponse([{message:'Notification deleted.' }], 200, 'Notification deleted.');
      });

  } catch (err) {
      return  helper.errorResponse(err, 400, 'Something went wrong.');
  }

}
/**
 * Send mail
 * @param {*} emailData
 */
exports.sendMail = async ( emailData ) => {
  const { mailTemplate, ...mailInfo } = emailData;

  try{
    const mailHtml = await ejs.renderFile(mailTemplate, mailInfo, {async: true});

    let notificationCreated;
    // console.log('mailInfo', mailInfo);

    if( mailInfo.emailList instanceof Array ) {
      for await (let user of mailInfo.emailList) {
        console.log('sending mail to : ', user);
        notificationCreated = await createNotification({
          user_email: user,
          ...mailInfo
        });
      }
    } else {
        console.log('sending mail to : ', mailInfo.emailList);

        notificationCreated = await createNotification({
          user_email : mailInfo.emailList,
          ...mailInfo
        });
    }

    console.log('notificationCreated', notificationCreated)
    if(notificationCreated.error)  return helper.errorResponse([], 500, 'Failed to create notification.');

    const mailOptions = {
      from: process.env.MAIL_ID_FROM,
      to: mailInfo.emailList,
      subject: mailInfo.subject,
      html: mailHtml,
    };

    console.log('SENDING MAIL...');

    const mailResponse = await mails.sendMail(mailOptions);

    console.log('mailResponse', mailResponse);

    if(!mailResponse.messageId) {
      return helper.errorResponse([], 500, 'Email could not be sent');
    }
    return helper.successResponse(mailInfo, 200, `Request mail sent to users`);

  }catch(error) {
    console.log('SEND MAIL ERROR', error);
    return helper.errorResponse([], 500, 'Something went wrong,while sending mail.');
  }

}


/**
 * Create a new notification
 * @param {*} notificationData
 * @returns
 */
async function createNotification( notificationData ){

  const { user_email, title, message, sent_time, type  } = notificationData;

  console.log('CREATE NOTIFICATION CALLED', notificationData)

  try{
    if(!user_email)  helper.errorResponse('User email required', 500, 'User email required.');
    if(!message)  helper.errorResponse('Notification message required', 500, 'Notification message required.');


      const newNotification = await notification.create({
        user_email: user_email,
        title: title,
        message: message,
        sent_time: new Date(),
        type: type,
        // status:status,
      });

      console.log('newNotification', newNotification)

      if(newNotification) {
        return newNotification;
      }

      return false;

  } catch(err) {
      return helper.errorResponse(err.message, 500, 'Something went wrong.');
  }
}

exports.getUnverifiedScreenMessage = async ( req, res ) => {
  const { email } = req.query;


  console.log('email', email);

    notification.find({email : { $regex: new RegExp(`^${email}`, "i") } }, {__v: 0}, (err, notification) => {
      if (!notification) res.status(404).json(helper.errorResponse([], 404, 'No notification found by this id.'));
      return res.status(200).json(helper.successResponse(notification, 200, 'Notification details.'));
    });
}

exports.totalUnreadCount = async ( userEmail ) => {
  try{
    if(!userEmail)  helper.errorResponse('User email required', 500, 'User email required.');

      const totalUnReadCount = await notification.countDocuments({ user_email: userEmail, status : 0 });

      console.log('totalUnReadCount', totalUnReadCount)
      return totalUnReadCount;

  } catch(err) {
      return helper.errorResponse(err.message, 500, 'Something went wrong.');
  }
}

exports.notificationList = async ( userEmail ) => {
  try{
    if(!userEmail)  helper.errorResponse('User email required', 500, 'User email required.');

      const notificationList = await notification.find({ user_email: userEmail, deleted_date: { $eq : null }}, {__v: 0, deleted_date: 0 });

      // console.log('notificationList', notificationList)
      return notificationList;

  } catch(err) {
      return helper.errorResponse(err.message, 500, 'Something went wrong.');
  }
}