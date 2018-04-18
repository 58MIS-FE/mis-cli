let path = require('path');
let metadata = require('read-metadata');
let getGithubConfig = require('./git-user.js');
let validateName = require('validate-npm-package-name');
let fs = require('fs');

/**
 * 读取meta中的信息
 *
 * @param {String} dir
 * @return {Object}
 */

function getMetadata(dir) {
    let json = path.join(dir, 'meta.json');
    let js = path.join(dir, 'meta.js');
    let setting = {};

    if (fs.existsSync(json)) {
        setting = metadata.sync(json);
    } else if (fs.existsSync(js)) {
        let req = require(path.resolve(js));
        if (req !== Object(req)) {
            throw new Error('meta.js needs to expose an object');
        }
        setting = req;
    } else {
        return {
            prompts: {},
            filters: {}
        }
    }

    return setting;
}

/**
 * 设置命令行中问题答案的默认值
 *
 * @param {Object} setting
 * @param {String} key
 * @param {String} val
 */

function setDefault(setting, key, val) {

    let prompts = setting.prompts || (setting.prompts = {});
    if (!prompts[key] || typeof prompts[key] !== 'object') {
        prompts[key] = {
            'type': 'string',
            'default': val
        }
    } else {
        prompts[key]['default'] = val;
    }
}

function setValidateName(setting) {
    let name = setting.prompts.name;
    let customValidate = name.validate;

    name.validate = function(name) {
        let res = validateName(name);
        if (!res.validForNewPackages) {
            let errors = (res.errors || []).concat(res.warnings || []);
            return 'Sorry, ' + errors.join(' and ') + '.';
        }
        if (typeof customValidate === 'function') {
            return customValidate(name);
        }

        return true
    }
}

/**
 * 导出命令行选择的信息
 *
 * @param {String} projectName
 * @param {String} tmpDir
 * @return {Object}
 */

module.exports = function(projectName, tmpDir) {
    let setting = getMetadata(tmpDir);

    /**
     * 如果传过来的是个对象，就取/分割下路径的最后一项
     */
    if (typeof projectName == 'object') {
        projectName = projectName['name'].split('/')[projectName['name'].split('/').length - 1];
    }

    setDefault(setting, 'name', projectName);
    setValidateName(setting);

    let authorInfo = getGithubConfig();

    authorInfo && (function() {
        setDefault(setting, 'author', authorInfo);
    }());

    return setting;
};