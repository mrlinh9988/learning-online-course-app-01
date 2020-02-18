const mongoose = require('../configs/dbConnect');
var Schema = mongoose.Schema;

// Course Schema
var CourseSchema = new Schema({
    title: String,
    description: String,
    level: {
        type: Number,
        default: 0
    },
    lession: [{
<<<<<<< HEAD
        type: String,   
=======
        type: mongoose.Schema.Types.ObjectId,
>>>>>>> 10d5d935c6bab1de27301643479ac866d5744ca1
        ref: 'lession'
    }]

}, {
    collection: 'course'
});

var CourseModel = mongoose.model('course', CourseSchema);

module.exports = CourseModel;