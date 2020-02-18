const mongoose = require('../configs/dbConnect');
var Schema = mongoose.Schema;
;

// User Schema
var UserSchema = new Schema({
    local: {
        email: String,
        password: String
    },
    facebook: {
        id: String,
        name: String
    },
    type: {
        type: Number,
        default: 1
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

    // console.log('aa: ', userObject.local || userObject.facebook);
    if (userObject.local) {
        delete userObject.local.password
    } else if (userObject.facebook) {
        delete userObject.facebook.id
    }

    return userObject;
}

// UserSchema.methods.hashPassword = function () {
//     console.log(this);
//     const hash = bcrypt.hash(this.local.password, saltRounds);
//     return hash;
// }



// // kiểm tra password có hợp lệ không
// UserSchema.methods.validPassword = function (password) {
//     return bcrypt.compareSync(password, this.local.password);
// };





var UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel
