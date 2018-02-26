const templateUrlMap = {
    'mis-vue-cli': '58MIS-FE/mis-vue-cli',
    'mis-react-cli': '58MIS-FE/mis-react-cli',
    'mis-koa':'58MIS-FE/mis-koa',
    'mis-h5-rem':'58MIS-FE/mis-h5-rem',
    'mis-server': '58MIS-FE/mis-server',
    'mis-vue-component':'58MIS-FE/mis-vue-component'
}

/**
 * 模板
 */
function getTemplateUrlMap(){
    return templateUrlMap
}

function getTemplatesList() {
    return Object.keys(templateUrlMap);
}














exports.getTemplatesList = getTemplatesList;
exports.getTemplateUrlMap = getTemplateUrlMap
