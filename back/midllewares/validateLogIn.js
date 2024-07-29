const LoginValidation = require("../validations/LoginValidation");
const ExpressError = require("../utils/ExpressError")

const validateLogIn = (req, res, next) => {
    const { error } = LoginValidation.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpressError(msg, 400)
    }
    next();
}
module.exports = { validateLogIn }