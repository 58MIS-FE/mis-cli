const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const pageGenerate = require('../util/generate').pageTemplate;
const vueAst = require('mis-vue-ast');

/**
 * page构建方法，传入命令行参数以及生成模板路径后构建page页
 * @param {Object || String} args 命令行参数 
 * @param {String} cwd 生成模板的路径
 */
async function page(args, cwd) {
    if (!args[0] || typeof args[0] != 'string') {
        console.log('Please enter the name of the page module');
        return;
    }

    let fileName = args[0];

    vueAst.api.createTemp(path.join(cwd, '/src/' + fileName), '', {
            'filePath': 'index.html',
            'pageName': fileName
        },

        function() {
            console.log('Page creation success');
        });
}


module.exports = page;