const joi = require('joi');



const roles = ['admin', 'laboratoire', 'employee'];

const schema = joi.object({
  email: joi.string().email().required(),
  role: joi.string().valid(...roles).required().messages({
    'any.only': 'Invalid role'
  }),
  username: joi.string().pattern(/^[a-zA-Z\s]+$/).required().messages({
    'string.pattern.base': 'Username doit contenire que des lettres'
  }),
  laboratoire: joi.string().when('role', {
    is: 'laboratoire',
    then: joi.required().messages({
      'any.required': 'Laboratoire est obligatoire sauf pour les administrateurs et les employés'
    }),
    otherwise: joi.optional()
  }),
  phone: joi.string().pattern(/^[0-9]+$/).required().messages({
    'string.pattern.base': 'Phone must contain only numbers'
  }),
  approved: joi.boolean()
  ,
  password: joi.string().min(4).optional().messages({
    'string.min': 'Password must be at least 4 characters long'
  }),
  employee: joi.object().when('role', {
    is: 'employee',
    then: joi.object({
      firstname: joi.string().required().messages({
        'any.required': 'First name is required for employees'
      }),
      lastname: joi.string().required().messages({
        'any.required': 'Last name is required for employees'
      })
    }),
    otherwise: joi.object({
      firstname: joi.string().allow('').optional(),
      lastname: joi.string().allow('').optional()
    })
  })
});


module.exports = schema;