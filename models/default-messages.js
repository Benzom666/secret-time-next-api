/*
 * Schema for DefaultMessageSchema table
 */
const mongoose = require("mongoose");

const { Schema } = mongoose;

const DefaultMessageSchema = new Schema({
    photos: { type: Array },
    tagline: { type: Array },
    description: { type: Array },
    photosTagline: { type: Array },
    photosDescription: { type: Array },
    taglineAndDesc: { type: Array },
    photosTaglineDescription: { type: Array },
    postMessage: { type: Array },
    profileUpdate: { type: Array },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
});

const defaultmessage = mongoose.model("defaultmessage", DefaultMessageSchema);

module.exports = defaultmessage;
