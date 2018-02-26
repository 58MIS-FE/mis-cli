const { prompt } = require('inquirer')
const question = require('../util/question')
const answers = require('../util/answers')
const download = require('../util/download')
const fileUtil = require('../util/file')
const  path = require('path');

/**
 * create 函数 
 * @returns ok
 */

module.exports = prompt(question).then((inputValue) => {
      let templateName = answers(inputValue).template.name,
          projectName = answers(inputValue).base.name,
          templateDir = path.join(process.cwd(),projectName)
    // 下载projectName 
      fileUtil.mkdir(projectName)
         .then(
            download(templateName,templateDir)
            .then(function(templateDir) {
                console.log(templateDir)
            })
         )
      
        
 })