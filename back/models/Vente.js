const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const formatDate = (date) => {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const venteSchema = new Schema({
    stock_res_off: { type: Number, required: true },
    cm: { type: Number, required: true },
    mois: { type: Number, required: true },
    vente_res_off: { type: Number, /*required: true*/ },
    stock_dep_reg: { type: Number, /*required: true*/ },
    vente_dep_reg: { type: Number, /*required: true*/ },
    entree: { type: Number, /*required: true*/ },
    reception: { type: Number, /*required: true*/ },
    s_douane: { type: Number, /*required: true*/ },
    annonce: { type: Number, /*required: true*/ },
    solde_cde: { type: Number, /*required: true*/ },
    encours: { type: Number, /*required: true*/ },
    reference: { type: mongoose.Schema.Types.ObjectId, ref: 'Reference', /*required: true*/ },
    date_depot: {
        type: String,
        required: true,
        default: () => formatDate(Date.now())
    },
    libelle: { type: String, required: true },
    produit: { type: mongoose.Schema.Types.ObjectId, ref: 'Produit', /*required: true*/ },
    laboratoire: { type: mongoose.Schema.Types.ObjectId, ref: 'Laboratoire', /*required: true*/ }
});
venteSchema.index({ reference: 1, produit: 1 }, { unique: true });
const Vente = mongoose.model('Vente', venteSchema);

module.exports = Vente;
