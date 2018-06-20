const Handlebars = require('handlebars');
const Metalsmith = require('metalsmith');
const ora = require('ora');
const async = require('async');
const render = require('consolidate').handlebars.render;
const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const log = require('./log');
const getSetting = require('./settings');
const ask = require('./ask');
const filesFilter = require('./files-filter');
const os = require('os');

Handlebars.registerHelper('if_eq', function(a, b, opts) {
    return a === b ?
        opts.fn(this) :
        opts.inverse(this)
});

Handlebars.registerHelper('unless_eq', function(a, b, opts) {
    return a === b ?
        opts.inverse(this) :
        opts.fn(this)
});

/**
 *
 * @param {String} projectName
 * @param {String} tmpDir
 * @param {String} dest
 * @param {Function} done
 */

exports.initTemplate = (projectName, tmpDir, dest, done) => {

    let metalsmith;

    let setting = getSetting(projectName, tmpDir);
    let tplPath = path.join(tmpDir, 'template');

    setting.helpers && Object.keys(setting.helpers).map(function(key) {
        Handlebars.registerHelper(key, setting.helpers[key])
    });

    if (fs.existsSync(tplPath)) {
        metalsmith = Metalsmith(tplPath);
    } else {
        metalsmith = Metalsmith(tmpDir);
    }

    let data = Object.assign(metalsmith.metadata(), {
        destDirName: projectName,
        isCwd: dest === process.cwd(),
        noEscape: true
    });

    metalsmith
        .use(askQuestions(setting))
        .use(filter(setting))
        .use(template)
        .clean(false)
        .source('.')
        .destination(dest)
        .build(function(err) {
            log.tips();

            if (err) {
                return done(err);
            }

            ora({
                text: chalk.green(`Success! Created ${projectName} at ${dest}.
We suggest that you begin by typing:
cd ${projectName}
npm install or cnpm install
npm start
Happy hacking!`)
            }).succeed();

            log.tips();

            done(null, setting.completeMessage);
        });

    return data;
};


exports.pageTemplate = () => {
    console.log('pageTemplate');
};


function askQuestions(setting) {
    return (files, metalsmith, done) => {
        ask(setting.prompts, metalsmith.metadata(), done);
    }
}

function filter(setting) {
    return (files, metalsmith, done) => {
        let misCliCatch = os.tmpdir() + '/misCliCatch.json';
        fs.writeFileSync(misCliCatch, JSON.stringify(metalsmith.metadata()));
        filesFilter(setting.filters, files, metalsmith.metadata(), done);
    }
}

function template(files, metalsmith, done) {
    let keys = Object.keys(files);
    let metadata = metalsmith.metadata();

    async.each(keys, (file, next) => {

        let inNodeModules = /node_modules/.test(file);
        let str = inNodeModules ? '' : files[file].contents.toString();

        if (inNodeModules || !/{{([^{}]+)}}/g.test(str)) {
            return next();
        }

        render(str, metadata, (err, res) => {
            if (err) {
                return next(err);
            }
            files[file].contents = new Buffer(res);
            next();
        });
    }, done);
}