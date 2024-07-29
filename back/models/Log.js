const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const logSchema = new Schema({
    action: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    timestamp: { type: Date, default: Date.now },
    before: { type: Object },
    after: { type: Object }
});


const Log = mongoose.model('Log', logSchema);

module.exports = Log;
