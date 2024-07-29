const ProduitVaidation = require("../validations/ProduitValidate");
const ExpressError = require("../utils/ExpressError")

const validateProduit = (req, res, next) => {
    const { error } = ProduitVaidation.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateProduit }