
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const produitSchema = new Schema({
  code: {
    type: String,
    required: true,
    unique: true
  },
  designation: {
    type: String,
    required: true
  },
  laboratoire: {
    type: Schema.Types.ObjectId,
    ref: 'Laboratoire',
    required: true
  },
  status: {
    type: String,
    enum: ['en stock', 'épuisé'],
    required: true
  }
}, { timestamps: true });

const Produit = mongoose.model('Produit', produitSchema);

module.exports = Produit;
