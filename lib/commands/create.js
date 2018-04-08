const { prompt } = require('inquirer');
const { question } = require('../util/question');
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
const generate = require('../util/generate').initTemplate;
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

    const Content = '\n' + chalk.green([
        '##     ## ####  ######           ######  ##       ####',
        '###   ###  ##  ##    ##         ##    ## ##        ## ',
        '#### ####  ##  ##               ##       ##        ## ',
        '## ### ##  ##   ######  ####### ##       ##        ## ',
        '##     ##  ##        ##         ##       ##        ## ',
        '##     ##  ##  ##    ##         ##    ## ##        ## ',
        '##     ## ####  ######           ######  ######## ####',
        '   '
    ].join('\n'));

    process.stdout.write(Content + '\n');

    if (fs.existsSync(targetDir)) {
        if (options.force) {
            rimraf.sync(targetDir);
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

                rimraf.sync(targetDir);
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
            let templateName = inputValue.template,
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
                    break;
                default:
                    break;
            }
        }

        /**
         * 模板构建，默认为58MIS-FE/mis-vue-startup
         * @param {string} template 
         */
        function downloadAndGenerate(template) {
            let tmp = os.tmpdir() + '/mis-cli-template-' + uuidV1();

            let spinner = ora({
                text: `start downloading template: ${template}`,
                color: "blue"
            }).start();

            downloadGitRepo(template, tmp, { clone: clone }, (err) => {
                process.on('exit', () => rimraf.sync(tmp));

                if (err) {
                    spinner.text = chalk.red(`Failed to download template ${template}: ${err.message.trim()}`);
                    spinner.fail();
                    process.exit(1);
                }
                spinner.text = chalk.yellow(`A newer version of mis-cli is available.`);
                spinner.succeed();

                generate(projectName, tmp, targetDir, (err, msg = "") => {
                    if (err) {
                        log.error(`Generated error: ${err.message.trim()}`);
                    }

                    /*if (origin && /\.git$/.test(origin)) {
                        setOrigin();
                    }*/

                    /*if (msg) {
                        let re = /{{[^{}]+}}/g;
                        log.tips('\n' + msg.replace(re, preProjectName).split(/\r?\n/g).map(function(line) {
                            return '   ' + line
                        }).join('\n'));
                    }*/
                });
            });
        }
    }
}


module.exports = create;