const { check } = require('express-validator');

const courseValidation = [
    check('code').notEmpty(),
    check('name').notEmpty(),
    check('term').isIn(['Winter', 'Spring', 'Summer', 'Fall'])
];

const registrationValidation = [
    check('courseId').notEmpty().withMessage('Course ID is required'),
];

module.exports = {
    courseValidation,
    registrationValidation
}; 