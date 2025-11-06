/*
* Schema for promotion table
*/
const mongoose = require('mongoose');

const { Schema } = mongoose;

const PromotionSchema = new Schema({
  creator_name: { type: String, required: true },
  influencer_name: { type: String, required: true },
  coupon: { type: String, required: true, unique: true },
  coupon_amount: { type: Number, required: true },
  coupon_rule: { type: String, default: 'percentage' },
  source: { type: String, required: true },
  applied_count: { type: Number, default : 0},
});

const Promotion = mongoose.model('Promotion', PromotionSchema);

module.exports = Promotion;
