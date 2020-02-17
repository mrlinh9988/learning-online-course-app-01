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
            type: mongoose.Schema.Types.ObjectId,
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

UserSchema.methods.toJSON = function () {

    // Chuyển dữ liệu dạng document của Mongoose thành raw object JS
    const userObject = this.toObject();

    console.log('aa: ', userObject.local || userObject.facebook);
    if (userObject.local) {
        delete userObject.local.password
    } else if (userObject.facebook) {
        delete userObject.facebook.id
    }

    return userObject;
}

// UserSchema.methods.generateAuthToken = function () {
//     // console.log(this);
//     const token = jwt.sign({ _id: this._id.toString() }, 'linh'); // vì this/_id là ObjectID nên cần chuyển thành String
//     this.tokens = this.tokens.concat({ token });
//     return token;
// }

// // kiểm tra password có hợp lệ không
// UserSchema.methods.validPassword = function (password) {
//     return bcrypt.compareSync(password, this.local.password);
// };





var UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel
