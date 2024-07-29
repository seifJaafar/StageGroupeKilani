const LaboValidate = require("../validations/LaboValidation");
const ExpressError = require("../utils/ExpressError")

const validateLabo = (req, res, next) => {
    const { error } = LaboValidate.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateLabo }