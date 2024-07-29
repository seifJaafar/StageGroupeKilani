const Joi = require('joi');

const produitSchema = Joi.object({
    code: Joi.string()
        .pattern(/^[0-9]+$/)
        .required()
        .messages({
            'string.base': 'Le code doit être une chaîne de caractères',
            'string.empty': 'Le code ne peut pas être vide',
            'any.required': 'Le code est requis',
            'string.pattern.base': '"Code" doit contenir que des chiffres'
        }),
    designation: Joi.string()
        .required()
        .messages({
            'string.base': 'La désignation doit être une chaîne de caractères',
            'string.empty': 'La désignation ne peut pas être vide',
            'any.required': 'La désignation est requise',
        }),
    laboratoire: Joi.string()
        .required()
        .messages({
            'string.base': 'La laboratoire doit être une chaîne de caractères',
            'string.empty': 'La laboratoire ne peut pas être vide',
            'any.required': 'La laboratoire est requis'
        }),
    status: Joi.string()
        .valid('en stock', 'épuisé')
        .required()
        .messages({
            'string.base': 'Le statut doit être une chaîne de caractères',
            'string.empty': 'Le statut ne peut pas être vide',
            'any.required': 'Le statut est requis',
            'any.only': 'Le statut doit être soit "en stock" soit "épuisé"'
        })
});

module.exports = produitSchema;