const fs = require('fs');
const path = require('path');

/**
 * 可选模板列表对象
 */
const templateUrlMap = {
    'mis-vue-cli': '58MIS-FE/mis-vue-cli',
    'mis-react-cli': '58MIS-FE/mis-react-cli',
    'mis-koa': '58MIS-FE/mis-koa',
    'mis-h5-rem': '58MIS-FE/mis-h5-rem',
    'mis-server': '58MIS-FE/mis-server',
    'mis-vue-component': '58MIS-FE/mis-vue-component'
}

/**
 * 获取模板对象
 */
function getTemplateUrlMap() {
    return templateUrlMap
}

/**
 * 模板数组转换，转换后为['mis-vue-cli', 'mis-react-cli' ...]
 */
function getTemplatesList() {
    return Object.keys(templateUrlMap);
}

/**
 * 获取模板目录，如果为. || /开头，或者:d盘符，返回true，否则返回当前目录下的tpl目录是否存在
 * @param {string} tpl 
 * retrun boolean
 */
function isLocalTemplate(tpl) {
    let isLocal = tpl.startsWith('.') || tpl.startsWith('/') || /^\w:/.test(tpl);

    if (isLocal) {
        return isLocal;
    } else {
        return fs.existsSync(path.normalize(path.join(process.cwd(), tpl)));
    }
}

exports.getTemplatesList = getTemplatesList;
exports.getTemplateUrlMap = getTemplateUrlMap;
exports.isLocalTemplate = isLocalTemplate;