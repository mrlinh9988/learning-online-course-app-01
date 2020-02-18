const mongoose = require('../configs/dbConnect');
var Schema = mongoose.Schema;
// Lession Schema
var LessionSchema = new Schema({
    title: String,
    content: String,
    solution: String,
    course: {
        type: String,
        ref: 'course'
    }
}, {
    collection: 'lession'
})

var LessionModel = mongoose.model('lession', LessionSchema);

module.exports = LessionModel;