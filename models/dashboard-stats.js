
/*
* Schema for Temp Stats table
* We will store the last caluclated stats of dashboard
*/
const mongoose = require('mongoose');
const moment = require('moment-timezone')
const { Schema } = mongoose;

const DashboardSchema = new Schema({
  total_users: { type: String, required: true },
  new_users: { type: String, required: true },
  deactivated_users: { type: String, required: true },
//  created_at: { type: Date, default: Date.now },
created_at: {
    type: Date,
    default:()  => moment().tz('America/Toronto').toDate()
  },  
updated_at: { type: Date },
});

const DashBoardStats = mongoose.model('DashBoardStats', DashboardSchema);

module.exports = DashBoardStats;
