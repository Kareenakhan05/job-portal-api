const { query, param } = require('express-validator');

//  Job Search Validator
const validate_job_search = [
    query('keyword')
        .notEmpty()
        .withMessage('Keyword is required')
        .isString()
        .withMessage('Keyword must be a string')
];

//  Job Application Validator
const validate_job_application = [
    param('job_id')
        .isMongoId()
        .withMessage('Invalid Job ID')
];

//  Job Details Validator
const validate_job_details = [
    param('job_id')
        .isMongoId()
        .withMessage('Invalid Job ID')
];

module.exports = {
    validate_job_search,
    validate_job_application,
    validate_job_details
};
