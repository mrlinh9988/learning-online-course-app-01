const mongoose = require('../configs/dbConnect');
var Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const saltRounds = 10;

// User Schema
var UserSchema = new Schema({
    local: {
        username: String,
        password: String
    },
    facebook: {
        id: String,
        name: String
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

// UserSchema.methods.generateHash = async function (password) {
//     // return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
//     const salt = await bcrypt.genSalt(saltRounds);
//     return await bcrypt.hash(password, salt, null);
// };
// // kiểm tra password có hợp lệ không
// UserSchema.methods.validPassword = function (password) {
//     return bcrypt.compareSync(password, this.local.password);
// };





var UserModel = mongoose.model('user', UserSchema);



module.exports = UserModel
