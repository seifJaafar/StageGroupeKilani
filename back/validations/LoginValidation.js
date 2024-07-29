const joi = require('joi');


const schema = joi.object({
    email : joi.string().email().required(),
    password : joi.string().min(4).required()
})

module.exports = schema;