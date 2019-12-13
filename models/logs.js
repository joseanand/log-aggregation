var mongoose = require ('mongoose');

var logSchema = new mongoose.Schema({
    _id: String,
    level: String,
    loggerName: String,
    message: String,
    date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', logSchema);