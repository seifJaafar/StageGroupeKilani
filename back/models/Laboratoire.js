const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LaboratoireSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        index: { unique: true }
    },
    designation: {
        type: String,
        required: true,
        maxlength: 128,
        trim: true,
        lowercase: true,
        unique: true
    }
}, {
    timestamps: true
}

)

const Laboratoire = mongoose.model("Laboratoire", LaboratoireSchema);
module.exports = Laboratoire;