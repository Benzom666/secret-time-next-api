/*
* Schema for payment table
*/
const mongoose = require('mongoose');

const { Schema } = mongoose;

const PaymentSchema = new Schema({
  username_id: { type: String },
  transaction_id: { type: String },
  amount: { type: String },
  tax: { type: String },
  bank_name: { type: String },
  payment_status: { type: String },
  currency: { type: String },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
  deleted_date: { type: Date },
});

const payment = mongoose.model('payment', PaymentSchema);

module.exports = payment;
