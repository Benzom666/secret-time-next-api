const helper = require("../../helpers/helper");
const Category = require("../../models/category");
const _ = require("lodash");

exports.getAllList = async (req, res) => {
    try {
        const result = await Category.find({}, { __v: 0 });

        if (result.length > 0) {
            result.forEach((res) => {
                res.name = _.upperFirst(res.name);
            });
        }

        if (result)
            res.status(200).json(
                helper.successResponse(result, 200, "All Category fetched successfully")
            );
    } catch (err) {
        console.log(err);
        return res.status(500).json(helper.errorResponse(err, 500, "Something went wrong."));
    }
};
