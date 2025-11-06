/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const Influencer = require('../../models/influencer');
const helper = require('../../helpers/helper');
const mails = require('../../helpers/mails');
const ejs = require('ejs');


exports.getAllInfluencer = async (req, res) => {
  let {
    current_page = 1,
    per_page = 10,
    email = '',
    name = '',
    sort = 'created_at',
    order = -1,
    status = '',
    active = false
  } = req.query;

  // console.log(per_page, email, name, order, status)

  current_page = parseInt(current_page);
  per_page = parseInt(per_page);

  let query = {
    status : { $ne : 4 },
    ...(status && status.length &&  { status: { $eq: status } } ),
    ...(active && active.length &&  { active: active } ),
    ...(email && email.length &&  { email: { $regex: new RegExp(`^${email}`, "i") } } ),
    ...(name && name.length &&  { name: { $regex: new RegExp(`^${name}`, "i") } } ),
  };

  try {

    let fields = { _id: 0,  __v: 0 };
    if (current_page < 1) res.status(400).json(helper.errorResponse([], 400, 'Invalid page number, should start with 1.'));

    const skip = per_page * (current_page - 1);
    const total_influencer = await Influencer.countDocuments(query);
    const total_pages = Math.ceil(total_influencer / per_page);

    if(total_influencer == 0) {
      return res.status(400).json(helper.errorResponse([], 400, 'No influencer found.Refine your search.'));
    }

    if (current_page > total_pages){
      current_page = total_pages;
    }

    Influencer.find(query)
    .skip(skip)
    .limit(per_page)
    .sort({ [sort]: order })
    .select(fields)
    .exec((err, influencer) => {
      if (!err) {
        return res.status(200).json(helper.successResponse({
          influencer,
          pagination: {
            current_page,
            per_page,
            total_influencer,
            total_pages,
          },
        }, 200, 'All influencer fetched successfully !'));
      }
      return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
    });

  } catch (err) {
    console.log(err);
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns Object
 * 1 : Pending, 2: Verified, 3 Block ( deactivated ), 4: Delete ( soft )
 */
exports.getStats = async (req, res) => {
 try {
  const { change } = req.body;

  let stats = {};

  const totalInfluencer = await Influencer.countDocuments({
    status : { $ne : 4 }
  });

  const verified = await Influencer.aggregate([
    {
      $match: {
        status: 2,
      }
    },
    {
      $count: 'verified'
    }
  ]);

  const active = await Influencer.aggregate([
    {
      $match: {
        active: true,
        status : { $ne : 4 },
      }
    },
    {
      $count: 'active'
    }
  ]);

  const inactive = await Influencer.aggregate([
    {
      $match: {
        active: false,
        status : { $ne : 4 },
      }
    },
    {
      $count: 'inactive'
    }
  ]);

  const pending = await Influencer.aggregate([
    {
      $match: {
        status: 1
      }
    },
    {
      $count: 'pending'
    }
  ]);

  const deactivated = await Influencer.aggregate([
    {
      $match: {
        status: 3
      }
    },
    {
      $count: 'deactivated'
    }
  ]);

 if(totalInfluencer)
 {
  stats.total =  totalInfluencer;
 }

 if(pending.length)
 {
  stats.pending =  pending[0].pending;
 }

 if(deactivated.length)
 {
  stats.deactivated =  deactivated[0].deactivated;
 }

 if(active.length)
 {
  stats.active =  active[0].active;
 }

 if(inactive.length)
 {
  stats.inactive =  inactive[0].inactive;
 }
  res.status(200).json(helper.successResponse(stats, 200, 'Influencer stats.'));


  } catch (err) {
    console.log(err);
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
};

exports.create = async ( req, res ) => {
  try{

    let {
      email,
      name,
      source,
      code,
      promo
    } = req.body;

    console.log( req.body );

    email = email.toLowerCase();
    name = name.toLowerCase();
    source = source.toLowerCase();
    code = code.toLowerCase();
    promo =  promo.toLowerCase();

    const influencer = new Influencer({
      email,
      name,
      source,
      code,
      promo
     });


    let success = await influencer.save();

    if(success){
      res.status(201).json(helper.successResponse(helper.influencerResponse(success), 201, 'Influence created successfully!'));
    }

  }catch(err) {
    console.log(err.message);
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
}


exports.exists = async(req, res) => {
  let  {
    email = ''
  } = req.query;

  try{
    Influencer.findOne({ email: email.toLowerCase() }, (err, influencer) => {
      if (influencer) {
        return res.status(403).json(helper.errorResponse([{message:'Influencer email already exist.' }], 403, 'Influencer email already exist'));
      }

      return res.status(200).json(helper.successResponse({ message:'New influencer email.You can use this.' }, 200, 'New email!'));
    });

  }catch(err) {
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
}

exports.codeExists = async(req, res) => {
  let  {
    code = ''
  } = req.query;

  try{

    Influencer.findOne({ code: code.toLowerCase() }, (err, code) => {
      if (code) {
        return res.status(403).json(helper.errorResponse([{message:'Code already used.Create a new one.' }], 403, 'Code already exist'));
      }

      return res.status(200).json(helper.successResponse({ message:'You can use this code.'  }, 200, 'You can use this code.'));
    });

  }catch(err) {
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
}


exports.updateStatus = async(req, res) => {
  try{
    const {
      status = '',
      email = '',
      active = false
    } = req.body;


    const updated =  await Influencer.findOneAndUpdate({ email: email.toLowerCase() }, { status, active });

    return res.status(200).json(helper.successResponse({ updated: 'Influencer status updated.' }, 200, 'Influencer status updated.'));

  }catch(err) {
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
}
exports.delete = async(req, res) => {
  try{
    const {
      email = ''
    } = req.body;

    Influencer.findOne({ email: email.toLowerCase() }, (err, influencer) => {

      if (!influencer) res.status(404).json(helper.errorResponse([], 404, 'Influencer not found'));

        influencer.status = 4;
        influencer.save();

        return res.status(200).json(helper.successResponse([{message:'Influencer deleted.' }], 200, 'Influencer deleted.'));
      });

  }catch(err) {
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
}


exports.update = async(req, res) => {
  try{
    // const {
    //   active = false
    // } = req.body;

    const updated =  await Influencer.findOneAndUpdate({ email: req.body.email.toLowerCase() }, { ...req.body });

    return res.status(200).json(helper.successResponse({ updated: 'Influencer profile updated.' }, 200, 'Influencer profile updated.Profile needs to be verified by admin.'));

  }catch(err) {
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
}
