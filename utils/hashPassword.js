const bcrypt = require('bcrypt');
const saltRounds = 10

const hassPassword = function (password) {
    const hash = bcrypt.hash(password, saltRounds);
    return hash;
}

const comparePassword = function (password, hash) {
    return bcrypt.compare(password, hash);
}


module.exports = {
    hassPassword,
    comparePassword
}