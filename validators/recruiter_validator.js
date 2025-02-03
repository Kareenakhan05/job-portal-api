const { check } = require('express-validator');

// Validator for posting a job
const validatePostJob = [
    check('title').notEmpty().withMessage('Job title is required'),
    check('description').notEmpty().withMessage('Job description is required'),
    check('skills').notEmpty().withMessage('Skills are required'),
    check('location').notEmpty().withMessage('Job location is required'),
    check('salary').isNumeric().withMessage('Salary should be a numeric value')
];

// Validator for updating a job
const validateUpdateJob = [
    check('title').optional().notEmpty().withMessage('Job title is required'),
    check('description').optional().notEmpty().withMessage('Job description is required'),
    check('skills').optional().notEmpty().withMessage('Skills are required'),
    check('location').optional().notEmpty().withMessage('Job location is required'),
    check('salary').optional().isNumeric().withMessage('Salary should be a numeric value')
];

module.exports = {
    validatePostJob,
    validateUpdateJob
};
