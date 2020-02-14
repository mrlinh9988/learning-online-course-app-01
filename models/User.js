const mongoose = require('../configs/dbConnect');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

// User Schema
var UserSchema = new Schema({
    username: String,
    password: String,
    facebookId: {
        type: String
    },
    type: {
        type: Number,
        default: 3
    },
    isVerify: {
        type: String,
        default: null
    },
    course: [{
        courseId: {
            type: String,
            ref: 'course'
        },
        status: {
            type: String,
            default: null
        }
    }]
}, {
    collection: 'user'
});

UserSchema.methods.generateHash = async function (password) {
    // return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
    const salt = await bcrypt.genSalt(saltRounds);
    return await bcrypt.hash(password, salt);
};
// kiểm tra password có hợp lệ không
UserSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};


// Course Schema
var CourseSchema = new Schema({
    title: String,
    description: String,
    level: {
        type: Number,
        default: 0
    },
    lession: [{
        type: String,
        ref: 'lession'
    }]

}, {
    collection: 'course'
});

// Lession Schema
var LessionSchema = new Schema({
    title: String,
    content: String,
    solution: String
}, {
    collection: 'lession'
})

var UserModel = mongoose.model('user', UserSchema);
var CourseModel = mongoose.model('course', CourseSchema);
var LessionModel = mongoose.model('lession', LessionSchema);

module.exports = {
    UserModel,
    CourseModel,
    LessionModel
}
