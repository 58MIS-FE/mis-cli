
let Promise = require('bluebird'),
    downloadGitRepo = require('download-git-repo'),
    ora = require('ora'),
    path = require('path');

let util = require('./util'),
    FileUtil = require('./file');


/**
 * 下载函数
 * @param {模板名称} templateName 
 * @param {模板地址} templateDir 
 */

module.exports = function(templateName,templateDir){
    let templateUrlMap = util.getTemplateUrlMap(),
        templateUrl = templateUrlMap[templateName]
     
   return new Promise(function(resolve,reject) {
        if (!templateUrl) {
            return reject(new Error('Invcalid template name'));
        }
        
        let spinner = ora('downloading template: ' + templateName);
        // 开始下载
        spinner.start();
        downloadGitRepo(templateUrl, templateDir, {clone: false}, function (err) {
            spinner.stop();
            if (err) {
                reject(err);
            }
            resolve(templateDir);
        });
   })
}