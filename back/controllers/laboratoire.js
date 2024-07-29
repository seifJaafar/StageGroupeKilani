const Laboratoire = require('../models/Laboratoire');
const Vente = require('../models/Vente');
const log = require('../models/Log');
const apiJson = require('../utils/apiJson');


exports.create = async (req, res, next) => {
    try {
        const Lab = await new Laboratoire(req.body);
        await Lab.save();
        const newLog = new log({ action: `Ajout de laboratoire ${req.body.designation}`, user: req.user.sub });
        await newLog.save();
        apiJson({ req, res, data: { Lab }, model: Laboratoire });
    } catch (err) {
        next(err)
    }
}
exports.getAll = async (req, res, next) => {
    try {
        const laboratoires = await Laboratoire.find();
        apiJson({ req, res, data: { laboratoires }, model: Laboratoire });
    } catch (err) {
        next(err)
    }
}
exports.UpdateLabo = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { designation, code } = req.body;
        const updateFields = { designation, code };
        const laboBeforeUpdate = await Laboratoire.findById(id);
        if (!laboBeforeUpdate) {
            const msg = "Laboratoire not found";
            throw new ExpressError(msg, 400);
        }
        const UpdatedLabo = await Laboratoire.findByIdAndUpdate(id, updateFields, { new: true });
        if (!UpdatedLabo) {
            const msg = "Laboratoire not found";
            throw new ExpressError(msg, 400);
        }
        const data = { message: "Laboratoire Updated succefuly" };
        const newLog = new log({ action: `mettre à jour Laboratoire ${designation}`, user: req.user.sub, before: laboBeforeUpdate, after: UpdatedLabo });
        await newLog.save();
        return apiJson({ req, res, data, model: Laboratoire });
    } catch (err) {
        next(err);
    }
}
exports.deleteLabo = async (req, res, next) => {
    try {
        const id = req.params.id;

        const labo = await Laboratoire.findByIdAndDelete(id);

        if (!labo) {
            throw new ExpressError("Labo not found", 404);
        }

        const data = { message: "Labo deleted successfully" };
        const newLog = new log({ action: `Supprimer Laboratoire ${labo.designation}`, user: req.user.sub });
        await newLog.save();
        return apiJson({ req, res, data, model: Laboratoire });
    } catch (err) {
        next(err);
    }
};
exports.getVentes = async (req, res, next) => {
    try {
        const { laboratoire, Begindate, EndDate, field, selectedProduit } = req.query;
        if (laboratoire) {
            if (field && Begindate && EndDate && selectedProduit) {
                const ventes = await Vente.find({ laboratoire, date_depot: { $gte: Begindate, $lte: EndDate }, produit: selectedProduit }).populate("reference").sort({ date_depot: 1 });
                if (!ventes) {
                    throw new ExpressError("ventes not found", 404);
                }
                const data = { ventes };
                return apiJson({ req, res, data, model: Vente });
            } else {
                const ventes = await Vente.find({ laboratoire }).populate("reference").sort({ date_depot: 1 });
                if (!ventes) {
                    throw new ExpressError("ventes not found", 404);
                }
                const data = { ventes };
                return apiJson({ req, res, data, model: Vente });

            }
        } else {
            const message = "laboratoire non connue"
            throw new ExpressError(message, 400);
        }
    } catch (err) {
        next(err)
    }
}