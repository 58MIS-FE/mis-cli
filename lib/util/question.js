let util = require('../util/util')

const question = [{
        type: 'input',
        name: 'author',
        message: 'What\'s your author?',
    },
    {
        type: 'list',
        name: 'template',
        message: 'Which template do you need?',
        choices: util.getTemplatesList(),
    },
];

const actionChoice = {
    'vue-config': [{
        type: 'input',
        name: 'ESlint',
        message: 'use ESlint? [Y/N]?'
    }, {
        type: 'input',
        name: 'element-ui',
        message: 'use element-ui? [Y/N]?'
    }]
};


exports.question = question;
exports.actionChoice = actionChoice;