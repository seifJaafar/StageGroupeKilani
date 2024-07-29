const joi = require('joi');


const schema = joi.object({
  designation: joi.string()
    .pattern(/^[A-Za-z]+$/)
    .required()
    .messages({
      'string.pattern.base': '"designation" doit contenir que des lettres',
      'string.empty': '"designation" ne doit pas être vide',
      'any.required': '"designation" est obligatoire'
    }),
  code: joi.string()
    .pattern(/^[0-9]+$/)  // Regular expression to allow only numbers
    .required()
    .messages({
      'string.pattern.base': '"code" doit contenir que des chiffres',
      'string.empty': '"code" ne doit pas être vide',
      'any.required': '"code" est obligatoire'
    })
})

module.exports = schema;