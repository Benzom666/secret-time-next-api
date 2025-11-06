const helper = require("../../helpers/helper");
const Aspiration = require("../../models/aspiration");
const _ = require("lodash");

exports.getAllList = async (req, res) => {
    try {
        let query = {};
        if (req.query.category_id) {
            query = { category_id: req.query.category_id };
        }

        const result = await Aspiration.find(query, { __v: 0 });

        if (result.length > 0) {
            result.forEach((res) => {
                res.name = _.upperFirst(res.name);
            });
        }

        if (result)
            res.status(200).json(
                helper.successResponse(result, 200, "All aspiration fetched successfully")
            );
    } catch (err) {
        console.log(err);
        return res.status(500).json(helper.errorResponse(err, 500, "Something went wrong."));
    }
};
