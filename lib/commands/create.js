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
const downloadGitRepo = require('download-git-repo');


let template = 'mis-vue-startup';

async function create(args) {
    let options = {},
        projectName = '.';
    if (typeof args[0] == 'object') {

    } else {
        options = args[1];
        projectName = args[0];
    }

    const inCurrent = projectName === '.';
    const name = inCurrent ? path.relative('../', process.cwd()) : projectName;
    const targetDir = path.resolve(projectName || '.');
    const clone = options.clone || false;

    if (fs.existsSync(targetDir)) {
        if (options.force) {
            //rimraf.sync(targetDir)
        } else {
            //await clearConsole();
            if (inCurrent) {
                const { ok } = await prompt([{
                    name: 'ok',
                    type: 'confirm',
                    message: `Generate project in current directory?`
                }]);

                if (!ok) {
                    return;
                }

            } else {
                const { ok } = await prompt([{
                    name: 'ok',
                    type: 'confirm',
                    message: `目录已存在，是否覆盖?`
                }]);

                if (!ok) {
                    return;
                }
                console.log('删除目录', targetDir);
            }

            run(projectName);
        }
    } else {
        run(projectName);
    }

    /**
     * 根据用户指令下载对应模板
     * @param {Sting} projectName 
     */
    function run(projectName) {
        prompt(question).then(inputValue => {
            let templateName = answers(inputValue).template,
                templateDir = path.join(process.cwd(), projectName);

            if (projectName != '.') {
                fileUtil.mkdir(projectName)
                    .then(() => {
                        downloadFile(inputValue, templateDir);
                    });
            } else {
                downloadFile(inputValue, templateDir);
            }

        });

        /**
         * 下载模板
         * @param {输入信息} inputValue 
         * @param {模板路径} templateDir 
         */
        function downloadFile(inputValue, templateDir) {
            const templateName = inputValue['template'];
            switch (templateName) {
                case 'mis-vue-cli':

                    downloadAndGenerate('58MIS-FE/mis-vue-startup');
                    // prompt(actionChoice['vue-config']).then((action) => {
                    //     download(templateName, templateDir, { clone })
                    //         .then(function(templateDir) {
                    //             console.log(templateDir);
                    //         });
                    // });
                    break;
                default:
                    break;
            }
        }

        /**
         * 下载模板
         * @param {string} template 
         */
        function downloadAndGenerate(template) {
            let tmp = os.tmpdir() + '/mis-cli-template-' + uuidV1();
            console.log('tmp', tmp);
            let spinner = ora({
                text: `start downloading template: ${template}`,
                color: "blue"
            }).start();

            downloadGitRepo(template, tmp, { clone: clone }, (err) => {
                process.on('exit', () => rimraf.sync(tmp));

                if (err) {
                    //err.code/err.message;
                    spinner.text = chalk.red(`Failed to download template ${template}: ${err.message.trim()}`);
                    spinner.fail();
                    process.exit(1);
                }
                spinner.text = chalk.green(`${template} downloaded success`);
                spinner.succeed();
                log.tips();
                return;
                generate(projectName, tmp, projectDirPath, (err, msg = "") => {
                    if (err) {
                        log.error(`Generated error: ${err.message.trim()}`);
                    }

                    if (origin && /\.git$/.test(origin)) {
                        setOrigin();
                    }

                    if (msg) {
                        let re = /{{[^{}]+}}/g;
                        log.tips('\n' + msg.replace(re, preProjectName).split(/\r?\n/g).map(function(line) {
                            return '   ' + line
                        }).join('\n'));
                    }
                });
            });
        }
    }
}


module.exports = create;