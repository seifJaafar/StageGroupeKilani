const express = require('express');
const controller = require('../controllers/auth');
const authorize = require('../midllewares/auth');
const roleAuthorize = require("../midllewares/roleAuth")
const { validateLogIn } = require("../midllewares/validateLogIn")
const { validateSignUp } = require("../midllewares/ValidateSignUp")
const { validateEmail } = require("../midllewares/ValidateEmail")

const router = express.Router();
router.route('/').get(authorize(), roleAuthorize("admin"), controller.GetAllusers);
router.route('/register').post(validateSignUp, controller.Register);
router.route('/login').post(validateLogIn, controller.LogIn);
router.route('/bytoken').get(authorize(), controller.ByToken);
router.route('/resetpassword').post(validateEmail, controller.ResetPassword);
router.route('/:id').patch(authorize(), validateSignUp, controller.UpdateUser)
    .delete(authorize(), roleAuthorize("admin"), controller.deleteUser);
router.route('/updatepassword/:id').patch(authorize(), controller.UpdatePassword);
router.route("/logs").get(authorize(), roleAuthorize("admin"), controller.GetLogs);
router.route("/reference/:id").delete(authorize(), roleAuthorize("admin"), controller.deleteReference);
module.exports = router;