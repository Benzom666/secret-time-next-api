const mongoose = require("mongoose");

const { Schema } = mongoose;

const aspirationSchema = new Schema({
    category_id: { type: Schema.Types.ObjectId, ref: "categories" },
    name: { type: String },
});

const Aspiration = mongoose.model("Aspiration", aspirationSchema);

module.exports = Aspiration;
