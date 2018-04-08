const exec = require('child_process').execSync;
const log = require('./log');

module.exports = () => {
    let userName, UserEmail;

    try {
        userName = exec('git config --get user.name')
        UserEmail = exec('git config --get user.emailiii')
    } catch (e) {}

    userName = userName && JSON.stringify(userName.toString().trim()).slice(1, -1);
    UserEmail = UserEmail && (' <' + UserEmail.toString().trim() + '>');
    return (userName || '') + (UserEmail || '')
};