let util = require('../util/util')

const question = [
    {
      type: 'input',
      name: 'name',
      message: 'What is the name of a project to be created',
      validate (val) {
        if(val !== '')  return true
        return 'Please enter a valid project name'
      }
    },
    {
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
  ]
  






module.exports = question 
