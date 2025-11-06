const Country = require('../../models/country');
const helper = require('../../helpers/helper');
const _ = require('lodash');



exports.getAllCountry = async(req,res)=>{
  try{
    const result = await Country.find({}, { __v:0 });
    
    if(result.length > 0) {
      result.forEach((res) => {
        res.name = _.upperFirst(res.name)
      })
    }

    if (result) res.status(200).json(helper.successResponse(result, 200, 'All Country fetched successfully'));

  }catch(err) {
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
}

exports.addCountry = async(req,res)=>{
  try{
    const country = new Country({
      ...req.body,
      name : req.body.name.toLowerCase()
    });

    const success = await country.save();

    if(success)res.status(201).json(helper.successResponse({ ...success._doc }, 201, 'Country added successfully!'));

  }catch(err) {
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  } 
}

exports.delete = async(req, res) => {
  try{
    const {
      name = ''
    } = req.body;

    Country.findOneAndDelete({ name: name.toLowerCase() }, (err, country) => {

        if (!country) res.status(404).json(helper.errorResponse([], 404, 'No country found.'));
        return res.status(200).json(helper.successResponse([{message:'Country deleted.' }], 200, 'Country deleted.'));
      });

  }catch(err) {
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
}

exports.update = async(req, res) => {
  try{
    const {
      id = null,
      name = '',
    } = req.body;

      Country.findOneAndUpdate({ _id: id }, { ...req.body , name : name.toLowerCase(), },  (err, country) => {

        if (!country) res.status(404).json(helper.errorResponse([], 404, 'No country found by this id.'));

        return res.status(200).json(helper.successResponse([{message:'Country updated.' }], 200, 'Country updated.'));
      });

  }catch(err) {
    return res.status(400).json(helper.errorResponse(err, 400, 'Something went wrong.'));
  }
}