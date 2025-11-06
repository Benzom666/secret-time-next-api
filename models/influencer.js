/*
* Schema for influencer table
*/
const mongoose = require('mongoose');

const { Schema } = mongoose;

const InfluencerSchema = new Schema({
  email: { type: String, required: true, unique: true },
  name: { type: String, required: true },

  source: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  promo: { type: String, required: true  },
  status: { type: Number, default: 1 }, // 1 : Pending, 2: Verified, 3 Block ( deactivated ), 4: Delete ( soft )
  
  count: { type: Number, default: 0 },

  active: { type: Boolean, default: false }, // true: active, false: inactive


  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date },
});

const Influencer = mongoose.model('Influencer', InfluencerSchema);

module.exports = Influencer;
