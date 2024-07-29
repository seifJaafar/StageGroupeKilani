const joi = require('joi');
const schema = joi.object({
    laboratoire: joi.string().required(),
    date: joi.string().required(),
    data: joi.array().required(),
})
module.exports = schema;