const mongoose = require('mongoose');
const Dates = require('../models/dates');
require('../lib/env');

console.log(process.env.MONGO_URI);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
    .then(() => console.error('connection successful'))
    .catch((err) => console.error(err));

mongoose.set('debug', true);

const seedDates = [
    {
        location: 'Delhi',
        country_code : 'IN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Mumbai',
        country_code : 'IN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Mumbai',
        country_code : 'IN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Toronto',
        country_code : 'CAN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Ottawa',
        country_code : 'CAN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Mumbai',
        country_code : 'IN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 23000,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Indoor',
        country_code : 'IN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Indoor',
        country_code : 'IN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'United States Of America',
        country_code : 'USA',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'United States Of America',
        country_code : 'USA',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'United States Of America',
        country_code : 'USA',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user2',
        verified: true,
        // verification_docs:
    },
    {
        location: 'United States Of America',
        country_code : 'USA',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data for user 2",
        date_status: true,
        user_name: 'user2',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Delhi',
        country_code : 'IN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Delhi',
        country_code : 'IN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 23000,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Delhi',
        country_code : 'IN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'Delhi',
        country_code : 'IN',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'United States Of America',
        country_code : 'USA',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'United States Of America',
        country_code : 'USA',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user1',
        verified: true,
        // verification_docs:
    },
    {
        location: 'United States Of America',
        country_code : 'USA',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data.",
        date_status: true,
        user_name: 'user2',
        verified: true,
        // verification_docs:
    },
    {
        location: 'United States Of America',
        country_code : 'USA',
        standard_class_date: "4",
        middle_class_dates: "4",
        executive_class_dates: "2",
        date_length: "30min",
        price: 2423,
        date_details: "Dummy date data for user 2",
        date_status: true,
        user_name: 'user2',
        verified: true,
        // verification_docs:
    }
];

const seedDB = async () => {
    await Dates.deleteMany({});
    await Dates.insertMany(seedDates);
};


seedDB().then( () => {
    mongoose.connection.close();
});
