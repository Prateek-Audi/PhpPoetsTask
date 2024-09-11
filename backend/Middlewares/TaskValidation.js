const Joi = require('joi');

const taskSchema = Joi.object({
    title: Joi.string().min(3).max(100).required().messages({
        'string.empty': 'Title cannot be empty',
        'string.min': 'Title must be at least 3 characters long',
        'any.required': 'Title is required'
    }),
    description: Joi.string().max(500).optional().messages({
        'string.max': 'Description cannot be more than 500 characters'
    }),
    priority: Joi.string().valid('Low', 'Medium', 'High').default('Low').messages({
        'any.only': 'Priority must be one of Low, Medium, or High'
    }),
    status: Joi.string().valid('Pending', 'Completed').default('Pending').messages({
        'any.only': 'Status must be either Pending or Completed'
    })
});


const createTaskValidation = (req, res, next) => {
    const { error } = taskSchema.validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map(err => err.message)
        });
    }
    next();
};

const updateTaskValidation = (req, res, next) => {
    
    const { error } = taskSchema.min(1).validate(req.body);
    if (error) {
        return res.status(400).json({
            message: "Validation error",
            details: error.details.map(err => err.message)
        });
    }
    next();
};

module.exports = {
    createTaskValidation,
    updateTaskValidation
};
