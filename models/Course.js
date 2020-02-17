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
        type: String,
        ref: 'lession'
    }]

}, {
    collection: 'course'
});

var CourseModel = mongoose.model('course', CourseSchema);

module.exports = CourseModel;