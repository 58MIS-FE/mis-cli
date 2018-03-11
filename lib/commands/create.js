const { prompt } = require('inquirer');
const { question, actionChoice } = require('../util/question');
const answers = require('../util/answers');
const download = require('../util/download');
const fileUtil = require('../util/file');
const path = require('path');
const rimraf = require('rimraf');


function run() {

}

async function create(args) {
    let options, projectName;
    if (typeof args[0] == 'object') {
        const projectName = '.';
    } else {
        options = args[1];
        projectName = args[0];
    }

    const inCurrent = projectName === '.';
    const name = inCurrent ? path.relative('../', process.cwd()) : projectName;
    const targetDir = path.resolve(projectName || '.');

    if (fs.existsSync(targetDir)) {
        if (options.force) {
            rimraf.sync(targetDir)
        } else {
            //await clearConsole();
            if (inCurrent) {
                const { ok } = await prompt([{
                    name: 'ok',
                    type: 'confirm',
                    message: `Generate project in current directory?`
                }])
                if (!ok) {
                    return;
                }
            } else {

            }
        }
    }

    function run() {
        prompt(question).then((inputValue) => {
            let templateName = answers(inputValue).template.name,
                projectName = answers(inputValue).base.name,
                templateDir = path.join(process.cwd(), projectName);

            fileUtil.mkdir(projectName)
                .then(() => {
                    const type = inputValue['template'];
                    switch (type) {
                        case 'mis-vue-cli':
                            prompt(actionChoice['vue-config']).then((action) => {
                                download(templateName, templateDir)
                                    .then(function(templateDir) {
                                        console.log(templateDir);
                                    });
                            });
                            break;
                        default:
                            break;
                    }

                })
        });
    }



}


module.exports = create;