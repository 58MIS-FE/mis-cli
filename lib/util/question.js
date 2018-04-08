let util = require('../util/util')

const question = [{
    type: 'list',
    name: 'template',
    message: 'Which template do you need?',
    choices: util.getTemplatesList(),
}, ];

exports.question = question;