const joi = require('joi');



const roles = ['admin', 'laboratoire', 'employee'];

const schema = joi.object({
  email: joi.string().email({ tlds: { allow: false } }).required(),
  role: joi.string().valid(...roles).required().messages({
    'any.only': 'Invalid role'
  }),
  username: joi.string().pattern(/^[a-zA-Z]+$/).required().messages({
    'string.pattern.base': 'Username doit contenire que des lettres'
  }),
  laboratoire: joi.string().when('role', {
    is: 'laboratoire',
    then:joi.required().messages({
      'any.required': 'Laboratoire est obligatoire sauf pour les administrateurs'
    }),
    otherwise:joi.optional()
  }),
  phone: joi.string().pattern(/^[0-9]+$/).messages({
    'string.pattern.base': 'Numéro de téléphone doit contenir que des chiffres'
  }),
  password: joi.string().min(4).optional().messages({
    'string.min': 'mot de passe doit contenir au moins 4 caractères'
  }),
  approved: joi.boolean().required(),
  employee: joi.object().when('role', {
    is: 'employee',
    then: joi.object({
      firstname: joi.string().required().messages({
        'any.required': 'nom est obligatoire pour les employés'
      }),
      lastname: joi.string().required().messages({
        'any.required': 'prénom est obligatoire pour les employés'
      })
    }),
    otherwise: joi.object({
      firstname: joi.string().allow('').optional(),
      lastname: joi.string().allow('').optional()
    })
  })
});


module.exports = schema;