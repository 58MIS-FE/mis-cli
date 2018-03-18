let semver = require('semver');
let chalk = require('chalk');
let axios = require('axios');
let ora = require('ora');

let pkg = require('../package.json');
let log = require('./log');

log.tips();

module.exports = function(done) {

    let spinner = ora({
        text: "checking mis-cli cli version...",
        color: "blue"
    }).start();

    if (!semver.satisfies(process.version, pkg.engines.node)) {
        spinner.text = chalk.white('mis-cli checking mis-cli  version failed, error message as follows:');
        spinner.fail();

        log.tips();
        log.error(`  You must upgrade node to ${pkg.engines.node} to use mis-cli`);
    }

    axios({
        url: 'https://registry.npmjs.org/mis-cli',
        method: 'get',
        timeout: 10000
    }).then((res) => {
        if (res.status === 200) {
            spinner.text = chalk.green('Checking mis-cli version success.');
            spinner.succeed();

            let local = pkg.version;
            let latest = res.data['dist-tags'].latest;

            if (semver.lt(local, latest)) {
                log.tips();
                log.tips(chalk.blue('  A newer version of mis-cli is available.'));
                log.tips();
                log.tips(`  latest:    ${chalk.green(latest)}`);
                log.tips(`  installed:    ${chalk.red(local)}`)
                log.tips(`  update mis-cli latest: npm update -g mis-cli`);
                log.tips();
            }
            done();
        }
    }).catch((err) => {
        if (err) {
            let res = err.response;

            spinner.text = chalk.white('mis-cli checking cli version failed, error message as follows:');
            spinner.fail();

            log.tips();

            if (res) {
                log.tips(chalk.red(`     ${res.statusText}: ${res.headers.status}`));
            } else {
                log.tips(chalk.red(`     ${err.message}`));
            }
            log.tips();
            done();
        }
    });
};