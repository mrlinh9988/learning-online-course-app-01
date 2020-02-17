const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/learning-online-project', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

module.exports = mongoose;