const apiJson = require('../utils/apiJson');
const ExpressError = require("../utils/ExpressError")
const Produit = require('../models/Produit');
const Reference = require('../models/Reference');
const Vente = require('../models/Vente');
const xlsx = require('xlsx');
const log = require('../models/Log');

exports.upload = async (req, res, next) => {
    try {
        const file = req.file;
        if (!file) {
            const msg = "No file uploaded"
            throw new ExpressError(msg, 400)
        }
        if (!['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'].includes(file.mimetype)) {
            const msg = "Le fichier doit être au format .xlsx"
            throw new ExpressError(msg, 400)
        }
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const jsonData = xlsx.utils.sheet_to_json(sheet, { header: 1 });
        apiJson({ req, res, data: jsonData });
    } catch (err) {
        next(err)
    }
}
exports.GetAllReferences = async (req, res, next) => {
    try {

        const laboratoire = req.query.laboratoire;

        let references;
        if (laboratoire && req.user.role === "laboratoire") {
            references = await Reference.find({ laboratoire }).populate({
                path: 'utilisateur',
                select: 'username email'
            }).populate('laboratoire').sort({ code: -1 });
        } else {
            if (req.user.role === "employee" || req.user.role === "admin") {
                references = await Reference.find().populate({
                    path: 'utilisateur',
                    select: 'username email'
                }).populate('laboratoire').sort({ code: -1 });
            }
        }
        if (!references) {
            throw new ExpressError("Aucune référence trouvée", 404)
        }
        apiJson({ req, res, data: references });
    } catch (err) {
        next(err)
    }
}
exports.produitByReference = async (req, res, next) => {
    try {
        const { refid } = req.params;
        const ventes = await Vente.find({ reference: refid }).populate('produit').populate('laboratoire').populate('reference');
        if (!ventes) {
            throw new ExpressError("Aucun produit trouvé", 404)
        }
        apiJson({ req, res, data: ventes });
    } catch (err) {
        next(err)
    }
}
exports.GetValidData = async (req, res, next) => {
    try {
        let validData = [];
        let invalidData = [];
        const uploadedData = req.body.data.data;
        const laboratoire = req.body.data.laboratoire;
        for (const item of uploadedData) {
            const ItemCode = String(item.Code).trim()
            const produit = await Produit.findOne({ code: ItemCode });
            if (produit && produit.laboratoire == laboratoire) {
                validData.push({ ...item });
            } else {
                invalidData.push(item);
            }
        }
        const Jsondata = { validData, invalidData }
        apiJson({ req, res, data: Jsondata });
    } catch (err) {
        next(err)
    }

}
exports.create = async (req, res, next) => {
    try {
        let savedData = [];
        let NotsavedData = [];
        const uploadedData = req.body.data.data;

        for (const item of uploadedData) {
            const ItemCode = String(item.Code).trim()
            const produit = await Produit.findOne({ code: ItemCode });
            if (produit && produit.laboratoire == req.body.data.laboratoire) {
                savedData.push({ ...item, produit: produit._id });
                if (produit.status === "épuisé") {
                    produit.status = "en stock";
                    await produit.save();
                }
            } else {
                NotsavedData.push(item);
            }
        }
        if (savedData.length > 0) {
            const newReference = new Reference({ utilisateur: req.user.sub, date_d_ajout: req.body.data.date, laboratoire: req.body.data.laboratoire });
            await newReference.save();
            for (const data of savedData) {
                const newVente = new Vente({
                    ...data,
                    reference: newReference._id,
                    laboratoire: req.body.data.laboratoire,
                    date_depot: newReference.date_d_ajout
                });
                await newVente.save();
            }
            const newLog = new log({ action: `Ajout de produit ${newReference.code}`, user: req.user.sub });
            await newLog.save();

        }
        const Jsondata = { savedData, NotsavedData }

        apiJson({ req, res, data: Jsondata });
    } catch (err) {
        next(err)
    }
}