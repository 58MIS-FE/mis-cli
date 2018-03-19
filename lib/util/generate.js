let Handlebars = require('handlebars');
let Metalsmith = require('metalsmith');
let ora = require('ora');
let async = require('async');
let render = require('consolidate').handlebars.render;
let path = require('path');
let chalk = require('chalk');
let fs = require('fs');
let log = require('./log');
let getSetting = require('./settings');
let ask = require('./ask');
let filesFilter = require('./files-filter');

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

module.exports = function(projectName, tmpDir, dest, done) {

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

    log.tips();

    metalsmith
        .use(askQuestions(setting))
        .use(filter(setting))
        .use(template)
        .clean(false)
        .source('.') // start from template root instead of `./src` which is Metalsmith's default for `source`
        .destination(dest)
        .build(function(err) {
            log.tips();

            if (err) {
                return done(err);
            }

            ora({
                text: chalk.green(`${projectName} generated  success`)
            }).succeed();

            log.tips();

            done(null, setting.completeMessage);
        });

    return data;
};

function askQuestions(setting) {
    return (files, metalsmith, done) => {
        ask(setting.prompts, metalsmith.metadata(), done);
    }
}

function filter(setting) {
    return (files, metalsmith, done) => {
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