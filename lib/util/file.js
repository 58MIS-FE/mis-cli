let Promise = require('bluebird'),
    SyncMkdir = require('mkdirp'),
    fs = require('fs');

/**
 * 检测文件是否存在
 * @param {名称} projectName 
 */

function checkFileExist(projectName) {

    return fs.existsSync(projectName);
}

/**
 * 创建项目
 * @param {名称} projectName 
 * 
 */

function mkdir (projectName) {

    return new Promise(function(resolve,reject){
        //检验是否存在文件夹
        if (checkFileExist(projectName)) {
            return reject(new Error(`The  projectName = ${projectName}  is exist`))
        }
        SyncMkdir.sync(projectName)

        return resolve();
    })

}







exports.mkdir = mkdir