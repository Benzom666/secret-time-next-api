/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const async = require("async");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const moment = require("moment-timezone");
const crypto = require("crypto");
const User = require("../../models/user");
const helper = require("../../helpers/helper");
const { parse } = require("path");

// exports.registrationCompleted = async (req, res) => {
//     let {
//         gender = "male",
//         sort = "email",
//         order = 1,
//         status = 2,
//         start_date = new Date(),
//         end_date = new Date(),
//     } = req.query;

//     // Convert start_date and end_date to 'EST'
//     start_date = moment(start_date).tz("America/New_York").utc().startOf("day").toDate();
//     end_date = moment(end_date).tz("America/New_York").utc().endOf("day").toDate();
//     console.log(start_date, end_date, "==========================");
//     try {
//         const registrationStats = await User.aggregate([
//             {
//                 $match: {
//                     gender,
//                     status: +status,
//                     created_at: { $gte: start_date, $lte: end_date },
//                 },
//             },
//             {
//                 $group: {
//                     _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
//                     count: { $sum: 1 },
//                 },
//             },
//             {
//                 $sort: { _id: -1 },
//             },
//             {
//                 $project: {
//                     _id: 0,
//                     created_at: { $toDate: "$_id" },
//                     count: 1,
//                 },
//             },
//         ]);

//         const dates = helper.loopThroughDateRange(start_date, end_date, registrationStats);
//         //console.log(dates)
//         res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
//     } catch (error) {
//         return res.status(500).json(helper.errorResponse([], 500, error));
//     }
// };

/*exports.registrationCompleted = async (req, res) => {
  let {
    gender = 'male',
    sort = 'email',
    order = 1,
    status = 2,
    start_date = new Date().toISOString(),
    end_date = new Date().toISOString()
  } = req.query;

  // Convert UTC to Canada Eastern Daylight Time (EDT, UTC-4)
  const offset = 4; // Adjust as needed for different parts of Canada
  const startDate = new Date(new Date(start_date).getTime() - offset*3600000);
  const endDate = new Date(new Date(end_date).getTime() - offset*3600000);

  try{
    const registrationStats = await User.aggregate([
      {
        $match: {
          gender,
          status: +status,
          created_at: { $gte: startDate, $lte: endDate },
          role: { $ne: 2 } // do not include admin users in stat
        },
      },
      {
        $group: {
          _id: {$dateToString:{format: "%Y-%m-%d", date: "$created_at"}},
          count: { $sum: 1 }
        }
      },
      {
        $sort : { _id : -1 }
      },
      {
        $project:  {
          _id: 0,
          created_at: { $toDate: "$_id", },
          count: 1,
       }
      },

    ]);

    const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
    res.status(200).json(helper.successResponse(dates, 200, 'Users registration stats.'));
  } catch(error) {
    return res.status(500).json(helper.errorResponse([], 500, error));
  }
};*/

/*exports.registrationCompleted = async (req, res) => {
  let {
    gender = 'male',
    sort = 'email',
    order = 1,
    status = 2
  } = req.body;

  // Set default values for start_date and end_date
  let start_date = req.body.start_date || moment().tz('America/Toronto').format();
  let end_date = req.body.end_date || moment().tz('America/Toronto').format();

  // Convert to JavaScript Date objects
  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  try{
    const registrationStats = await User.aggregate([
      {
        $match: {
          gender,
          status: +status,
          created_At: { $gte: startDate, $lte: endDate }
        },
      },
      {
        $group: {
          _id: {$dateToString:{format: "%Y-%m-%d", date: "$created_At"}},
          count: { $sum: 1 }
        }
      },
      {
        $sort : { _id : -1 }
      },
      {
        $project:  {
          _id: 0,
          created_At: { $toDate: "$_id", },
          count: 1,
        }
      },
    ]);

    const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
    res.status(200).json(helper.successResponse(dates, 200, 'Users registration stats.'));
  } catch(error) {
    return res.status(500).json(helper.errorResponse([], 500, error));
  }
};*/

/*exports.registrationCompleted = async (req, res) => {
  let {
    gender = 'male',
    sort = 'email',
    order = 1,
    status = 2
  } = req.body;

  let start_date = req.body.start_date || moment().tz('America/Toronto').format();
  let end_date = req.body.end_date || moment().tz('America/Toronto').format();

  const startDate = new Date(start_date);
  const endDate = new Date(end_date);

  try{
    const registrationStats = await User.aggregate([
      {
        $match: {
          gender,
          status: +status,
          created_at: { $gte: startDate, $lte: endDate }
        },
      },
      {
        $group: {
          _id: {$dateToString:{format: "%Y-%m-%d", date: "$created_at"}},
          count: { $sum: 1 }
        }
      },
      {
        $sort : { _id : -1 }
      },
      {
        $project:  {
          _id: 0,
          created_at: {
            $dateToString: {
              format: "%Y-%m-%d %H:%M:%S",
              date: { $toDate: "$_id" },
              timezone: 'America/Toronto'
            }
          },
          count: 1,
        }
      },
    ]);

    const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
    res.status(200).json(helper.successResponse(dates, 200, 'Users registration stats.'));
  } catch(error) {
    return res.status(500).json(helper.errorResponse([], 500, error));
  }
};*/
//const mongoose = require('mongoose');
//const moment = require('moment-timezone')
//const { Schema } = mongoose;

/*exports.registrationCompleted = async (req, res) => {
    let {
      gender = 'male',
      sort = 'email',
      order = 1,
      status = 2,
      start_date = moment().tz('Asia/Kolkata').format(),
      end_date = moment().tz('Asia/Kolkata').format()
    } = req.query;
  
    try {
      // Convert dates to JavaScript Date objects
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);
  
      const registrationStats = await User.aggregate([
        {
          $match: {
            gender,
            status: +status,
            created_at: { $gte: startDate, $lte: endDate }
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { _id: -1 }
        },
        {
          $project: {
            _id: 0,
            created_at: { $toDate: "$_id" },
            count: 1,
          }
        },
      ]);
  
      // Ensure the helper function is working as expected
      const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
      res.status(200).json(helper.successResponse(dates, 200, 'Users registration stats.'));
    } catch (error) {
      return res.status(500).json(helper.errorResponse([], 500, error));
    }
  };*/
/*exports.registrationCompleted = async (req, res) => {
    let {
      gender = 'male',
      sort = 'email',
      order = 1,
      status = 2
    } = req.body;
  
    let start_date = req.body.start_date || moment().tz('America/Toronto').format();
    let end_date = req.body.end_date || moment().tz('America/Toronto').format();
  
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
  
    try{
/*      const registrationStats = await User.aggregate([
        {
          $match: {
            gender,
            status: +status,
            created_at: { $gte: startDate, $lte: endDate }
          },
        },
        {
          $group: {
            _id: {$dateToString:{format: "%Y-%m-%d", date: "$created_at"}},
            count: { $sum: 1 }
          }
        },
        {
          $sort : { _id : -1 }
        },
        {
          $project:  {
            _id: 0,
            created_at: '$_id',
            count: 1,
          }
        },
      ]);
  
const registrationStats = await User.aggregate([
  {
    $match: {
      gender,
      status: +status,
      created_at: { $gte: startDate, $lte: endDate }
    },
  },
  {
    $group: {
      _id: {
        $dateToString: {
          format: "%Y-%m-%d", 
          date: "$created_at", 
          timezone: 'America/Toronto'  // Adjust timezone here.
        }
      },
      count: { $sum: 1 }
    }
  },
  {
    $sort : { _id : -1 }
  },
  {
    $project:  {
      _id: 0,
      created_at: {
        $dateToString: {
          format: "%Y-%m-%d %H:%M:%S",
          date: { $toDate: "$_id" },
          timezone: 'America/Toronto'  // Adjust timezone here.
        }
      },
      count: 1,
    }
  },
]);

      
    //  registrationStats.forEach(stat => {
      //  stat.created_at = moment.utc(stat.created_at).tz('America/Toronto').format("YYYY-MM-DD HH:mm:ss");
     // });

//registrationStats.forEach(stat => {
  //stat.created_at = moment(stat.created_at).tz('America/Toronto').format("YYYY-MM-DD HH:mm:ss");
//});
registrationStats.forEach(item => {
  item.created_at = moment.tz(item.created_at, 'UTC').tz('America/Toronto').format('YYYY-MM-DD HH:mm:ss');
});

      const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
      res.status(200).json(helper.successResponse(dates, 200, 'Users registration stats.'));
    } catch(error) {
      return res.status(500).json(helper.errorResponse([], 500, error));
    }
  };*/
/*exports.registrationCompleted = async (req, res) => {
    let {
      gender = 'male',
      sort = 'email',
      order = 1,
      status = 2
    } = req.body;
  
    let start_date = req.body.start_date || moment().tz('America/Toronto').startOf('day').toDate();
    let end_date = req.body.end_date || moment().tz('America/Toronto').endOf('day').toDate();
  
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
  
    try{
      let registrationStats = await User.aggregate([
        {
          $match: {
            gender,
            status: +status,
            created_at: { $gte: startDate, $lte: endDate }
          },
        },
        {
          $group: {
            _id: {$dateToString:{format: "%Y-%m-%d", date: "$created_at"}},
            count: { $sum: 1 }
          }
        },
        {
          $sort : { _id : -1 }
        },
        {
          $project:  {
            _id: 0,
            created_at: {
              $dateToString: {
                format: "%Y-%m-%d %H:%M:%S",
                date: { $toDate: "$_id" }
              }
            },
            count: 1,
          }
        },
      ]);
  
      
      registrationStats = registrationStats.map(item => {
        item.created_at = moment.utc(item.created_at, 'YYYY-MM-DD HH:mm:ss').tz('America/Toronto').format('YYYY-MM-DD HH:mm:ss');
        return item;
      });
  
      const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
      res.status(200).json(helper.successResponse(dates, 200, 'Users registration stats.'));
    } catch(error) {
      return res.status(500).json(helper.errorResponse([], 500, error));
    }
  };*/
exports.registrationCompleted1 = async (req, res) => {
    let { gender = "male", sort = "email", order = 1, status = 2 } = req.body;

    let start_date = req.body.start_date || moment().tz("America/Toronto").startOf("day");
    let end_date = req.body.end_date || moment().tz("America/Toronto").endOf("day");

    // Get the current offset for 'America/Toronto' in minutes
    const currentOffset = moment.tz("America/Toronto").utcOffset();

    // Adjust the query dates by the current offset
    const startDate = new Date(start_date.subtract(currentOffset, "minutes").toDate());
    const endDate = new Date(end_date.subtract(currentOffset, "minutes").toDate());

    try {
        let registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    created_at: "$_id",
                    count: 1,
                },
            },
        ]);

        // Now shift the created_at date back by the offset to display it in 'America/Toronto' timezone
        registrationStats = registrationStats.map((item) => {
            item.created_at = moment
                .utc(item.created_at, "YYYY-MM-DD")
                .add(currentOffset, "minutes")
                .format("YYYY-MM-DD HH:mm:ss");
            return item;
        });

        const dates = helper.loopThroughDateRange(start_date, end_date, registrationStats);
        res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};

exports.registrationCompleted12 = async (req, res) => {
    let { gender = "male", sort = "email", order = 1, status = 2 } = req.body;

    let start_date = req.body.start_date || moment().tz("America/Toronto").format();
    let end_date = req.body.end_date || moment().tz("America/Toronto").format();

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    try {
        const registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    created_at: {
                        $dateToString: {
                            format: "%Y-%m-%d %H:%M:%S",
                            date: { $toDate: { $add: [new Date(0), "$_id"] } },
                            timezone: "America/Toronto",
                        },
                    },
                    count: 1,
                },
            },
        ]);

        const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
        res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};
exports.registrationCompleted13 = async (req, res) => {
    let { gender = "male", sort = "email", order = 1, status = 2 } = req.body;

    let start_date = req.body.start_date || moment().startOf("day").toISOString();
    let end_date = req.body.end_date || moment().endOf("day").toISOString();

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    try {
        const registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    created_at: "$_id",
                    count: 1,
                },
            },
        ]);

        // Now convert the created_at date to 'America/Toronto' timezone
        registrationStats = registrationStats.map((item) => {
            item.created_at = moment
                .utc(item.created_at, "YYYY-MM-DD")
                .tz("America/Toronto")
                .format("YYYY-MM-DD HH:mm:ss");
            return item;
        });

        const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
        res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error.message));
    }
};
exports.registrationCompleted33 = async (req, res) => {
    let { gender = "male", sort = "email", order = 1, status = 2 } = req.body;

    let start_date =
        req.body.start_date || moment().tz("America/Toronto").startOf("day").toISOString();
    let end_date = req.body.end_date || moment().tz("America/Toronto").endOf("day").toISOString();

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    try {
        let registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    created_at: "$_id",
                    count: 1,
                },
            },
        ]);

        // Now convert the created_at date to 'America/Toronto' timezone
        registrationStats = registrationStats.map((item) => {
            item.created_at = moment
                .utc(item.created_at, "YYYY-MM-DD")
                .tz("America/Toronto")
                .format("YYYY-MM-DD HH:mm:ss");
            return item;
        });

        const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
        res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};
exports.registrtionCompleted44 = async (req, res) => {
    let { gender = "male", sort = "email", order = 1, status = 2 } = req.body;

    let start_date = req.body.start_date || moment().tz("America/Toronto").startOf("day").toDate();
    let end_date = req.body.end_date || moment().tz("America/Toronto").endOf("day").toDate();

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    try {
        let registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    created_at: "$_id",
                    count: 1,
                },
            },
        ]);

        // Now convert the created_at date to 'America/Toronto' timezone
        registrationStats = registrationStats.map((item) => {
            item.created_at = moment
                .tz(item.created_at, "YYYY-MM-DD", "America/Toronto")
                .format("YYYY-MM-DD HH:mm:ss");
            return item;
        });

        const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
        res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};
exports.registrationCompleted55 = async (req, res) => {
    let { gender = "male", sort = "email", order = 1, status = 2 } = req.body;

    let start_date = req.body.start_date || moment().tz("America/Toronto").startOf("day").toDate();
    let end_date = req.body.end_date || moment().tz("America/Toronto").endOf("day").toDate();

    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    try {
        let registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    created_at: "$_id",
                    count: 1,
                },
            },
        ]);

        // Now convert the created_at date to 'America/Toronto' timezone
        registrationStats = registrationStats.map((item) => {
            item.created_at = moment
                .tz(item.created_at, "YYYY-MM-DD", "America/Toronto")
                .format("YYYY-MM-DD HH:mm:ss");
            return item;
        });

        const dates = helper.loopThroughDateRange(startDate, endDate, registrationStats);
        res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};
exports.registrationCompletedtest = async (req, res) => {
    let {
        gender = "male",
        sort = "email",
        order = 1,
        status = 2,
        start_date = new Date(),
        end_date = new Date(),
    } = req.query;

    try {
        const registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: new Date(start_date), $lte: new Date(end_date) },
                },
            },
            {
                $group: {
                    // _id: "$created_at",
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    created_at: { $toDate: "$_id" },
                    count: 1,
                },
            },
        ]);
        console.log(registrationStats);

        const dates = helper.loopThroughDateRange(start_date, end_date, registrationStats);
        res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};
exports.registrationCompletedd = async (req, res) => {
    let {
        gender = "male",
        sort = "email",
        order = 1,
        status = 2,
        start_date = new Date(),
        end_date = new Date(),
    } = req.query;

    // Convert start_date and end_date to 'EST'
    start_date = moment.tz(start_date, "America/New_York").startOf("day").toDate();
    end_date = moment.tz(end_date, "America/New_York").endOf("day").toDate();

    try {
        const registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: start_date, $lte: end_date },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    created_at: { $toDate: "$_id" },
                    count: 1,
                },
            },
        ]);

        const dates = helper.loopThroughDateRange(start_date, end_date, registrationStats);
        console.log(dates);
        res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};
exports.registrationCompletedss = async (req, res) => {
    let {
        gender = "male",
        sort = "email",
        order = 1,
        status = 2,
        start_date = new Date(),
        end_date = new Date(),
    } = req.query;

    // Convert start_date and end_date to 'EST'
    start_date = moment.tz(start_date, "America/New_York").startOf("day").toDate();
    end_date = moment.tz(end_date, "America/New_York").endOf("day").toDate();

    try {
        const registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: start_date, $lte: end_date },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    created_at: { $toDate: "$_id" },
                    count: 1,
                },
            },
        ]);
        console.log(registrationStats, "hhjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjjj");
        const dates = helper.loopThroughDateRange(start_date, end_date, registrationStats);
        console.log(dates);
        res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};
exports.registrationCompletess = async (req, res) => {
    let {
        gender = "male",
        sort = "email",
        order = 1,
        status = 2,
        start_date = new Date(),
        end_date = new Date(),
    } = req.query;

    try {
        const registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: new Date(start_date), $lte: new Date(end_date) },
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: {
                            format: "%Y-%m-%d",
                            date: "$created_at",
                            timezone: "America/Toronto",
                        },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: -1 },
            },
            {
                $project: {
                    _id: 0,
                    created_at: { $toDate: "$_id" },
                    count: 1,
                },
            },
        ]);

        const dates = helper.loopThroughDateRange(start_date, end_date, registrationStats);
        const currentTime = moment().tz("America/Toronto");
        console.log(currentTime);

        res.status(200).json(
            helper.successResponse({ dates, currentTime }, 200, "Users registration stats.")
        );
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};
exports.registrationCompleted = async (req, res) => {
    let {
        gender = "male",
        sort = "email",
        order = 1,
        status = 2,
        start_date = new Date(),
        end_date = new Date(),
    } = req.query;

    // Convert start_date and end_date to 'EST'
    start_date = moment.tz(start_date, "America/New_York").startOf("day").toDate();
    end_date = moment.tz(end_date, "America/New_York").endOf("day").toDate();

    try {
        const registrationStats = await User.aggregate([
            {
                $match: {
                    gender,
                    status: +status,
                    created_at: { $gte: start_date, $lte: end_date },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$created_at" } },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 }, // Sort in ascending order based on the date
            },
        ]);

        console.log(registrationStats, "===");
        const dates = helper.loopThroughDateRange(start_date, end_date, registrationStats);

        res.status(200).json(helper.successResponse(dates, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};

/* Location data of user by gender, city & country
 * @param gender string ( male, female ),
 * @param locationType String (city & country),
 * @param status
 */

exports.geoStats = async (req, res) => {
    let { gender = "", locationType = "country", country = "", status = 2 } = req.query;

    let isCity = locationType == "country" ? "$country" : "$location";

    if (locationType == "city") {
        if (country == "") {
            return res
                .status(422)
                .json(
                    helper.errorResponse(
                        [{ country: "country needed for city  listing" }],
                        500,
                        "country needed for city  listing"
                    )
                );
        }
    }

    let matchQuery =
        locationType == "city"
            ? {
                  country,
                  status: +status,
              }
            : {
                  status: +status,
              };

    if (gender != "") {
        matchQuery.gender = gender;
    }
    console.log("here i sthe query", matchQuery);

    try {
        let registrationStats;

        registrationStats = await User.aggregate([
            {
                $match: matchQuery,
            },
            {
                $group: {
                    // _id: "$created_at",
                    _id: isCity,
                    totalCount: { $sum: 1 },
                },
            },
            {
                $sort: { _id: 1 },
            },
            {
                $project: {
                    _id: 0,
                    location: "$_id",
                    totalCount: "$totalCount",
                },
            },
        ]);

        const totalData = await User.countDocuments(matchQuery);
        registrationStats = registrationStats.map((row) => {
            return {
                ...row,
                count: row.totalCount,
                totalCount: parseFloat(((row.totalCount * 100) / totalData).toFixed(2)),
            };
        });

        res.status(200).json(
            helper.successResponse(registrationStats, 200, "Users registration stats.")
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};

/**
 * Total users data by start date and end date
 * @param start_date date,
 * @param end_date should be greater than start_date,
 * @param status for user acyive status
 */
exports.totalUsersback = async (req, res) => {
    let { status = 2, start_date = new Date(), end_date = new Date() } = req.query;
    let { userdata } = req.datajwt;

    try {
        let Totalusers = await User.aggregate([
            {
                $match: {
                    status: +status,
                    created_at: { $gte: new Date(start_date), $lte: new Date(end_date) },
                },
            },
            {
                $group: {
                    _id: 0,
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    count: "$count",
                },
            },
        ]);

        let progress = await User.aggregate([
            {
                $match: {
                    status: +status,
                    created_at: {
                        $gte: new Date(userdata.last_logged_in),
                        $lte: new Date(end_date),
                    },
                },
            },
            {
                $group: {
                    _id: 0,
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    count: "$count",
                },
            },
        ]);
        console.log("here i am:", progress);
        let dataToBeUpdated = {};
        let percent = 0;
        if (progress.length > 0) {
            if ((status = 2)) {
                dataToBeUpdated = {
                    last_logged_in: new Date(),
                    active_user_count: progress[0].count,
                };
                percent = (progress[0].count / userdata.active_user_count) * 100;
                percent =
                    progress[0].count < userdata.active_user_count
                        ? "-" + percent + "%"
                        : "+" + percent + "%";
            } else if (status == 1) {
                dataToBeUpdated = { last_logged_in: new Date(), new_user_count: progress[0].count };
                percent = (progress[0].count / userdata.new_user_count) * 100;
                percent =
                    progress[0].count < userdata.new_user_count
                        ? "-" + percent + "%"
                        : "+" + percent + "%";
            } else if (status == 4) {
                dataToBeUpdated = {
                    last_logged_in: new Date(),
                    deactivated_user_count: progress[0].count,
                };
                percent = (progress[0].count / userdata.deactivated_user_count) * 100;
                percent =
                    progress[0].count < userdata.deactivated_user_count
                        ? "-" + percent + "%"
                        : "+" + percent + "%";
            }
        } else {
            if ((status = 2)) {
                dataToBeUpdated = { last_logged_in: new Date(), active_user_count: 0 };
            } else if (status == 1) {
                dataToBeUpdated = { last_logged_in: new Date(), new_user_count: 0 };
            } else if (status == 4) {
                dataToBeUpdated = { last_logged_in: new Date(), deactivated_user_count: 0 };
            }
            percent = "0%";
        }

        await User.findByIdAndUpdate({ _id: userdata._id }, dataToBeUpdated, {
            rawResult: true,
            function(data) {
                console.log("data updated");
            },
        });

        // console.log(userdata);
        if (Totalusers.length > 0) {
            Totalusers[0].percent = percent;
        } else {
            Totalusers = [
                {
                    count: 0,
                    percent: "0%",
                },
            ];
        }
        res.status(200).json(helper.successResponse(Totalusers, 200, "Users registration stats."));
    } catch (error) {
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};

exports.totalUsers = async (req, res) => {
    let {
        status = [0, 1, 2, 3],
        start_date = new Date("01/01/2000"),
        end_date = new Date(),
    } = req.query;

    if (start_date == null || start_date == "") {
        start_date = new Date("01/01/2000");
    }
    if (end_date == null || end_date == "") {
        end_date = new Date();
    }
    if (status.length == 0) {
        status = [0, 1, 2, 3];
    }
    if (!Array.isArray(status)) {
        status = status.toString();
        status = Array.from(status);
    }

    try {
        const { userdata } = req.datajwt;
        const { last_logged_in = new Date("01 January 0 00:00:00 UTC") } = userdata;

        start_date = start_date ? start_date : last_logged_in;
        const diffTime = Math.abs(new Date(end_date) - new Date(start_date));
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        let prev_start_date = new Date(start_date);
        let prev_end_date = new Date(end_date);

        prev_start_date.setDate(new Date(start_date).getDate() - parseInt(diffDays));
        prev_end_date.setDate(new Date(end_date).getDate() - parseInt(diffDays));

        status = status.map((e) => parseInt(e));
        console.log("status here", status, start_date, end_date);
        let newUserQuery =
            status.indexOf(5) > -1
                ? { email_verified: true, documents_verified: false, status: { $eq: 1 } }
                : { status: { $in: status } };

        let latestTotalUsers = await User.aggregate([
            {
                $match: {
                    ...newUserQuery,
                    role: { $eq: 1 },
                    created_at: { $gte: new Date(start_date), $lte: new Date(end_date) },
                },
            },
            {
                $group: {
                    _id: 0,
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    count: "$count",
                },
            },
        ]);

        let prevTotalUsers = await User.aggregate([
            {
                $match: {
                    ...newUserQuery,
                    role: { $eq: 1 },
                    created_at: { $gte: new Date(prev_start_date), $lte: new Date(prev_end_date) },
                },
            },
            {
                $group: {
                    _id: 0,
                    count: { $sum: 1 },
                },
            },
            {
                $project: {
                    _id: 0,
                    count: "$count",
                },
            },
        ]);
        let prevCount = prevTotalUsers[0] ? prevTotalUsers[0].count : 1;
        let latestCount = latestTotalUsers[0] ? latestTotalUsers[0].count : 1;

        console.log("latestTotalUsers", latestTotalUsers);
        console.log("prevTotalUsers", prevTotalUsers);

        let percent = 0;
        // if(prevCount >0 && latestCount > 0){
        // percent = isFinite(latestCount / prevCount) ? (latestCount / prevCount) * 100 : 100;

        percent = isFinite(latestCount / prevCount)
            ? Math.abs((latestCount - prevCount) / prevCount) * 100
            : 100;

        // sign = latestCount.count <  prevCount ? "-" : "+"; // old
        sign = latestCount < prevCount ? "-" : "+";

        // }

        if (latestTotalUsers[0]) {
            latestTotalUsers[0].percent = percent;
            latestTotalUsers[0].sign = sign;
        } else {
            latestTotalUsers = [
                {
                    count: 0,
                    percent: 0,
                    sign: "+",
                },
            ];
        }

        res.status(200).json(
            helper.successResponse(latestTotalUsers, 200, "Users registration stats.")
        );
    } catch (error) {
        console.log(error);
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};

/**
 * New API to get total users with percentage
 */
exports.newTotalUsersWithPercentage = async (req, res) => {
    let user = req.datajwt.userdata;
    let {
        status = [1, 2, 3],
        start_date = new Date("01/01/2000"),
        end_date = new Date(),
    } = req.query;
    let newUserQuery =
        status.indexOf(5) > -1
            ? {
                  email_verified: true,
                  documents_verified: false,
                  status: { $eq: 1 },
                  role: { $eq: 1 },
              }
            : { status: { $in: status }, role: { $eq: 1 } };
    try {
        let latestTotalUsers = await User.find({
            ...newUserQuery,
            created_at: { $gte: new Date(start_date), $lte: new Date(end_date) },
        }).count();

        let prevTotalUsers = await User.find({
            ...newUserQuery,
            created_at: { $gte: new Date(start_date), $lte: new Date(user.before_last_logged_in) },
        }).count();

        let sign = latestTotalUsers < prevTotalUsers ? "-" : "+";
        let percent = (((latestTotalUsers - prevTotalUsers) * 100) / prevTotalUsers).toFixed(2);
        let data = {
            count: latestTotalUsers ? latestTotalUsers : 0,
            percent: percent ? percent : 0,
            sign: sign ? sign : "+",
        };
        res.status(200).json(helper.successResponse([data], 200, "Users registration stats."));
    } catch (error) {
        console.log(error);
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};

/**
 * Api to fetch verfied user, pending users and new users from db
 */
exports.usersCountWithPercentage = async (req, res) => {
    try {
        let user = await User.findOne({ _id: req.datajwt.userdata._id });
        let activeUsers = await getCountAndPercentage(
            user.before_last_logged_in,
            (activeUsersStatus = 2),
            "active"
        );
        let newUsers = await getCountAndPercentage(
            user.before_last_logged_in,
            (newUsersStatus = 1),
            "new"
        );
        let pendingUsers = await getCountAndPercentage(
            user.before_last_logged_in,
            (pendingUsersStatus = 1),
            "pending"
        );
        let newData = { activeUsers, newUsers, pendingUsers };
        res.status(200).json(helper.successResponse(newData, 200, "Users registration stats."));
    } catch (error) {
        console.log(error);
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};

/**
 * Api to return verfied user, pending users and new users from db
 * @param usersBeforeLoginDate date,
 * @param type type of user like new, pending, active etc,
 * @param status for user type status
 */
const getCountAndPercentage = async (usersBeforeLoginDate, status, type) => {
    let start_date = new Date("01/01/2000");
    let end_date = new Date();
    start_date = moment.tz(start_date, "America/New_York").utc().toDate();
    end_date = moment.tz(end_date, "America/New_York").utc().toDate();
    if (status == 2) {
        // active users query
        query = { role: { $eq: 1 }, status: { $in: [2] }, email_verified: true };
    }
    if (status == 1) {
        // new users and pending users query
        if (type === "new") {
            query = { role: { $eq: 1 }, status: { $eq: 1 }, email_verified: true };
        } else {
            query = { role: { $eq: 1 }, status: { $eq: 1 }, email_verified: false };
        }
    }
    let latestTotalUsers = await User.find({
        ...query,
        created_at: { $gte: start_date, $lte: end_date },
    }).count();

    let prevTotalUsers = await User.find({
        ...query,
        created_at: { $gte: start_date, $lte: new Date(usersBeforeLoginDate) },
    }).count();

    let percent = 0;
    if (prevTotalUsers == 0 && latestTotalUsers == 0) {
        percent = 0;
    } else if (prevTotalUsers > latestTotalUsers) {
        percent = 0;
    } else if (prevTotalUsers == 0 && latestTotalUsers > 0) {
        percent = latestTotalUsers * 100;
    } else {
        percent = parseFloat(
            (((latestTotalUsers - prevTotalUsers) * 100) / prevTotalUsers).toFixed(2)
        );
    }

    let data = {
        count: latestTotalUsers ? latestTotalUsers : 0,
        beforeLoginCount: prevTotalUsers ? prevTotalUsers : 0,
        percent: percent ? percent : 0,
    };
    return data;
};

/**
 * Api to fetch verfied user, pending users and new users from db by datetime
 */
exports.usersCountByDate = async (req, res) => {
    try {
        // let user = await User.findOne({_id: req.datajwt.userdata._id});
        let startDate = req.query.start_date ? req.query.start_date : new Date("01/01/2000");
        let endDate = req.query.end_date ? req.query.end_date : new Date();
        startDate = moment.tz(startDate, "America/New_York").utc().toDate();
        endDate = moment.tz(endDate, "America/New_York").utc().toDate();

        let userType = req.query.user_type ? req.query.user_type : "active"; // active, new, pending
        let status = req.query.status;

        if (status == 2) {
            // active users query
            userType = "active";
            query = { role: { $eq: 1 }, status: { $in: [2] }, email_verified: true };
        }
        if (status == 1) {
            // new users and pending users query
            if (userType === "new") {
                query = { role: { $eq: 1 }, status: { $eq: 1 }, email_verified: true };
            } else {
                userType = "pending";
                query = { role: { $eq: 1 }, status: { $eq: 1 }, email_verified: false };
            }
        }
        let usersCount = (
            await User.find({
                ...query,
                created_at: { $gte: startDate, $lte: endDate },
            })
        ).length;

        let data = {
            startDate,
            endDate,
            userType,
            count: usersCount ? usersCount : 0,
        };
        res.status(200).json(helper.successResponse(data, 200, "Users counts data."));
    } catch (error) {
        console.log(error);
        return res.status(500).json(helper.errorResponse([], 500, error));
    }
};
