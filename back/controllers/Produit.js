const Produit = require('../models/Produit');
const apiJson = require('../utils/apiJson');
const mongoose = require("mongoose")
const ExpressError = require("../utils/ExpressError")
const log = require('../models/Log');

exports.getAll = async (req, res, next) => {
    try {
        const produits = await Produit.find().populate('laboratoire');
        apiJson({ req, res, data: { produits }, model: Produit });
    } catch (err) {
        next(err)
    }
}
exports.create = async (req, res, next) => {
    try {
        req.body.laboratoire = new mongoose.Types.ObjectId(req.body.laboratoire);
        const newProduit = await new Produit(req.body);
        await newProduit.save();
        const newLog = new log({ action: `Ajout de produit ${req.body.designation}`, user: req.user.sub });
        await newLog.save();
        apiJson({ req, res, data: { newProduit }, model: Produit });
    } catch (err) {
        next(err)
    }
}
exports.UpdateProduct = async (req, res, next) => {
    try {
        const id = req.params.id;
        var { designation, code, status, laboratoire } = req.body;
        laboratoire = new mongoose.Types.ObjectId(laboratoire);
        const updateFields = { designation, code, status, laboratoire };
        const produitBeforeUpdate = await Produit.findById(id);
        if (!produitBeforeUpdate) {
            const msg = "Produit not found";
            throw new ExpressError(msg, 400);
        }
        const UpdatedProduit = await Produit.findByIdAndUpdate(id, updateFields, { new: true });
        if (!UpdatedProduit) {
            const msg = "Produit not found";
            throw new ExpressError(msg, 400);
        }
        const data = { message: "Produit Updated succefuly" };
        const newLog = new log({ action: `mettre à jour Produit ${designation}`, user: req.user.sub, before: produitBeforeUpdate, after: UpdatedProduit });
        await newLog.save();
        return apiJson({ req, res, data, model: Produit });
    } catch (err) {
        next(err);
    }
}
exports.getProduitByLabo = async (req, res, next) => {
    try {

        const laboratoire = req.query.laboratoire;

        const produits = await Produit.find({ laboratoire }).populate('laboratoire');
        if (!produits) {
            throw new ExpressError("Produit not found", 404);
        }
        const data = { produits };
        return apiJson({ req, res, data, model: Produit });
    } catch (err) {
        next(err)
    }
}
exports.deleteProduit = async (req, res, next) => {
    try {
        const id = req.params.id;

        const produit = await Produit.findByIdAndDelete(id);

        if (!produit) {
            throw new ExpressError("Produit not found", 404);
        }

        const data = { message: "Produit deleted successfully" };
        const newLog = new log({ action: `Supprimer Produit ${produit.designation}`, user: req.user.sub, before: produit });
        await newLog.save();
        return apiJson({ req, res, data, model: Produit });
    } catch (err) {
        next(err);
    }
};