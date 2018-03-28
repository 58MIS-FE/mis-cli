const { prompt } = require('inquirer');
const { question, actionChoice } = require('../util/question');
const answers = require('../util/answers');
const download = require('../util/download');
const fileUtil = require('../util/file');
const log = require('../util/log');
const path = require('path');
const rimraf = require('rimraf');
const ora = require('ora');
const os = require('os');
const fs = require('fs');
const uuidV1 = require('uuid/v1');
const chalk = require('chalk');
const pageGenerate = require('../util/generate').pageTemplate;
const downloadGitRepo = require('download-git-repo');


let template = 'mis-vue-startup';

async function page(args) {
    if (!args[0]) {
        console.log('请输入页面模块名称');
        return;
    }
}


module.exports = page;