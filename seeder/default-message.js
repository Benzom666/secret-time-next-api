const mongoose = require("mongoose");
const defaultMessage = require("../models/default-messages");

require("../lib/env");

const bcrypt = require("bcrypt");

mongoose
    .connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.error("connection successful"))
    .catch((err) => console.error(err));

mongoose.set("debug", true);

const seedDefaultMessage = [
    {
        photos: ["Sorry, we cannot verify your account. You need to upload better photos."],
        tagline: ["Sorry, we cannot verify your account. You need to change your tagline."],
        description: [
            "Sorry, we can not verify your account. You need to change your description.",
        ],
        photosTagline: [
            "Sorry, we cannot verify your account. You need to upload better photos and change your tagline.",
        ],
        photosDescription: [
            "Sorry, we cannot verify your account. You need to upload better photos and write a better description.",
        ],
        taglineAndDesc: [
            "Sorry, we cannot verify your account. You need to change your tagline and description.",
        ],
        photosTaglineDescription: [
            "Sorry, we cannot verify your account. You need to upload better photos. You also need to change your tagline and description.",
        ],
        postMessage: [
            "Please edit your description as you currently violating our policies. This is your final warning.",
        ],
        profileUpdate: [
            "We observed that you attempted to quickly navigate through the profile creation process. To ensure the best user experience, please note that Le Society only grants entry to individuals with well-crafted profiles.",
        ],
    },
];

const seedDB = async () => {
    await defaultMessage.deleteMany({});
    await defaultMessage.insertMany(seedDefaultMessage);
};

seedDB().then(() => {
    mongoose.connection.close();
});
