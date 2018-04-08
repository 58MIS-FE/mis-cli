const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const pageGenerate = require('../util/generate').pageTemplate;
const vueAst = require('mis-vue-ast');

async function page(args, cwd) {
    if (!args[0]) {
        console.log('请输入页面模块名称');
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