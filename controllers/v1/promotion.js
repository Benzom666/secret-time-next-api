/* eslint-disable no-console */
/* eslint-disable consistent-return */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
const async = require('async');
const bcrypt = require('bcrypt');
const randomNumber = require('random-number');
const mongoose = require('mongoose');
const ejs = require('ejs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Promotion = require('../../models/promotion');
const helper = require('../../helpers/helper');


/**
 * Signup user
 */
 exports.create = async (req, res) => {
  try{
      const promotion = new Promotion({
        ...req.body,
       });

      let success = await promotion.save()
      if(success){
        res.status(201).json(helper.successResponse(success, 201, 'Promotion created'));
      }
  }catch(error){
    res.status(400).json(helper.errorResponse({ error:error.message }, 400, 'Failed to create promotion'));
  }
}