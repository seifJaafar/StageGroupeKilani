const { sendEmail, CreateAccount, ResetPassword } = require('../utils/msgUtils');
const User = require('../models/user');
const Reference = require('../models/Reference');
const Vente = require('../models/Vente');
const apiJson = require('../utils/apiJson');
const crypto = require("crypto")
const mongoose = require("mongoose")
const ExpressError = require("../utils/ExpressError")
const Log = require('../models/Log');
const { timeStamp } = require('console');



exports.Register = async (req, res, next) => {
    try {
        const tempPass = crypto.randomBytes(16).toString('hex');
        if (req.body.laboratoire) {
            req.body.laboratoire = new mongoose.Types.ObjectId(req.body.laboratoire);
        } else if (!req.body.approved) {
            req.body.approved = false
        }
        const user = await new User({ ...req.body, password: tempPass });
        const UserEmail = user.email
        const UserName = user.username
        const role = user.role;
        await user.save();
        await sendEmail(CreateAccount({ role, Name: UserName, Email: UserEmail, password: tempPass }))?.then((val) => console.log("SMTP cv", val)).catch((err) => console.error("SMTP ERROR", err));
        const newLog = new Log({ action: `Création de compte ${user.username}`, user: req.user.sub, before: user });
        await newLog.save();
        apiJson({ req, res, data: { user }, model: User });
    } catch (error) {
        next(error)
    }
}
exports.UpdateProfile = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { email, username, phone } = req.body;
        const updateFields = { email, username, phone };
        const UpdatedUser = await User.findByIdAndUpdate(id, update, { new: true });
        if (!UpdatedUser) {
            const msg = "User not found";
            throw new ExpressError(msg, 400);
        }
        const data = { message: "User Updated succefuly" };
        return apiJson({ req, res, data, model: User });
    } catch (err) {
        next(err)
    }
}
exports.LogIn = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).exec();

        if (!user) {
            const msg = "Email ou mot de passe incorrect"
            throw new ExpressError(msg, 400)
        }

        const isPasswordValid = await user.validatePassword(password);
        if (!isPasswordValid) {

            const msg = "Email ou mot de passe incorrect"
            throw new ExpressError(msg, 400)
        }

        if (!user.approved) {
            const msg = "Inscription pas encore approuvée"
            throw new ExpressError(msg, 400)
        }

        const accessToken = await user.token();
        const data = { user, accessToken };
        const newLog = new Log({ action: "login", user: user._id });
        await newLog.save();
        return apiJson({ req, res, data, model: User });
    } catch (error) {
        next(error)
    }
}
exports.ByToken = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.sub).populate('laboratoire');
        const data = {
            user: user
        }
        res.status(200).json(data)
    } catch (err) {
        next(err)
    }
}
exports.UpdateUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { email, username, approved, role, phone, employee, laboratoire } = req.body;
        const updateFields = { email, username, phone, role, approved, laboratoire, employee };
        const userbeforeUpdate = await User.findById(id).select('username email role approved laboratoire employee').lean();
        if (!userbeforeUpdate) {
            const msg = "User not found";
            throw new ExpressError(msg, 400);
        }
        const UpdatedUser = await User.findByIdAndUpdate(id, updateFields, { new: true }).select('username email role approved laboratoire employee').lean();
        if (!UpdatedUser) {
            const msg = "User not found";
            throw new ExpressError(msg, 400);
        }
        const data = { message: "User Updated succefuly" };
        const newLog = new Log({ action: `mettre à jour profile ${UpdatedUser.username}`, user: req.user.sub, before: userbeforeUpdate, after: UpdatedUser });
        await newLog.save();
        return apiJson({ req, res, data, model: User });
    } catch (err) {
        next(err);
    }
}
exports.deleteReference = async (req, res, next) => {
    try {

        const reference = await Reference.findByIdAndDelete(req.params.id);
        
        if (!reference) {
            throw new Error('Reference not found');
        } else {
            await Vente.deleteMany({ reference: req.params.id });
            const newLog = new Log({ action: `Supprimer Référence ${reference.code}`, user: req.user.sub });
            await newLog.save();
            const data = { message: "Reference deleted successfully" };
            return apiJson({ req, res, data, model: Reference });
        }

    } catch (err) {
        console.log(err)
        next(err)
    }

}
exports.deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            throw new ExpressError("User not found", 404);
        }
        const newLog = new Log({ action: `Supprimer Utilisateur ${user.username}`, user: req.user.sub });
        await newLog.save();
        const data = { message: "User deleted successfully" };
        return apiJson({ req, res, data, model: User });
    } catch (err) {
        next(err);
    }
};
exports.UpdatePassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { old_password, new_password } = req.body;
        const user = await User.findById(id);
        if (!user) {
            const msg = "User not found";
            throw new ExpressError(msg, 400);
        } else {
            const isPasswordValid = await user.validatePassword(old_password);
            if (!isPasswordValid) {
                const msg = "Old password incorrect";
                throw new ExpressError(msg, 400);
            } else {
                user.password = new_password;
                await user.save();
                const data = { message: "Password Updated succefuly" };
                const newLog = new Log({ action: "update password", user: user._id });
                await newLog.save();
                return apiJson({ req, res, data, model: User });
            }
        }
        const msg = "erreur";
        throw new ExpressError(msg, 400);
    } catch (err) {
        next(err)
    }
}
exports.GetAllusers = async (req, res, next) => {
    try {
        const { role, approved } = req.query;

        const query = {};
        if (role) {
            query.role = role;
        }
        if (approved !== undefined) {
            if (approved === "true") {
                query.approved = true;
            } else {
                query.approved = false;
            }

        }
        const users = await User.find(query);
        const populatedUsers = await Promise.all(users.map(async (user) => {
            if (user.role === "laboratoire") {
                const PopulatedUser = await user.populate('laboratoire');
                return PopulatedUser;
            } else {
                return user;
            }
        }));
        const data = { users: populatedUsers };
        return apiJson({ req, res, data, model: User });
    } catch (err) {
        next(err);
    }
}
exports.ResetPassword = async (req, res, next) => {
    try {
        const email = req.body.email;
        const user = await User.findOne({ email }).exec();
        if (!user) {
            const msg = "Email incorrect";
            throw new ExpressError(msg, 400);
        }
        if (!user.approved) {
            const msg = "Compte pas encore approuvé par l'admin";
            throw new ExpressError(msg, 400);
        }
        const tempPass = crypto.randomBytes(16).toString('hex');
        user.password = tempPass;
        const name = user.username;
        const Email = user.email;
        await user.save();

        await sendEmail(ResetPassword({ NewPassword: tempPass, Name: name, Email }))
            .then((val) => console.log("SMTP cv", val))
            .catch((err) => console.error("SMTP ERROR", err));

        const data = { message: "Success password reset" };
        return apiJson({ req, res, data, model: User });
    } catch (err) {
        next(err);
    }
}
exports.GetLogs = async (req, res, next) => {
    try {
        const logs = await Log.find().populate('user').sort({ timestamp: -1 });
        const data = { logs };
        return apiJson({ req, res, data, model: Log });
    } catch (err) {
        next(err);
    }
}
