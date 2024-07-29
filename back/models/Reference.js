const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Vente = require('./Vente');



const getNextCounter = async (year, month) => {
    const startOfMonth = `${year}-${month.toString().padStart(2, '0')}-01`;
    const endOfMonth = `${year}-${month.toString().padStart(2, '0')}-31`;
    const references = await Reference.find({
        date_d_ajout: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ date_d_ajout: -1 });
    if (!references) {
        return '01';
    }
    let maxCounter = 0;
    references.forEach(reference => {
        const lastCode = reference.code;
        const lastCounter = parseInt(lastCode.slice(-2), 10);
        if (lastCounter > maxCounter) {
            maxCounter = lastCounter;
        }
    });
    return (maxCounter + 1).toString().padStart(2, '0');

};

const referenceSchema = new Schema({
    code: { type: String, unique: true },
    date_d_ajout: {
        type: String,
        required: true,
    },
    utilisateur: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    laboratoire: { type: mongoose.Schema.Types.ObjectId, ref: 'Laboratoire', required: true },

}, { timestamps: true });
referenceSchema.pre('save', async function (next) {
    if (!this.date_d_ajout) {
        throw new Error('date_d_ajout is required');
    }

    const dateParts = this.date_d_ajout.split('-');
    if (dateParts.length !== 3 || isNaN(Date.parse(this.date_d_ajout))) {
        throw new Error('Invalid date_d_ajout');
    }
    const year = dateParts[0];
    const month = dateParts[1];
    const counter = await getNextCounter(year, month);
    this.code = `Ref${year}-${month}-${counter}`;
    next();
});

const Reference = mongoose.model('Reference', referenceSchema);

module.exports = Reference;
