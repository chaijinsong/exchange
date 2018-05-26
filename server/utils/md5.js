var crypto = require('crypto');

function md5(password) {
    var md5 = crypto.createHash('md5');
    return md5.update(password).digest('hex');
}

module.exports = md5;