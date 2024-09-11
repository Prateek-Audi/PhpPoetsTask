const Joi = require('joi');

const signupValidation = (req, res, next) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(100).required().messages({
            'string.empty': 'Name cannot be empty',
            'string.min': 'Name must be at least 3 characters long',
            'any.required': 'Name is required'
        }),
        email: Joi.string().email().required().messages({
            'string.empty': 'Email cannot be empty',
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(4).max(100).required().messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least 4 characters long',
            'any.required': 'Password is required'
        })
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Bad request", error })
    }
    next();
}
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            'string.empty': 'Email cannot be empty',
            'string.email': 'Please enter a valid email address',
            'any.required': 'Email is required'
        }),
        password: Joi.string().min(4).max(100).required().messages({
            'string.empty': 'Password cannot be empty',
            'string.min': 'Password must be at least 4 characters long',
            'any.required': 'Password is required'
        })
    });
    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400)
            .json({ message: "Validation error", details: error.details.map(err => err.message) })
    }
    next();
}
module.exports = {
    signupValidation,
    loginValidation
}