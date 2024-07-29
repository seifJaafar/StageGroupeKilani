const express = require('express');
const controller = require('../controllers/laboratoire');
const authorize = require('../midllewares/auth');
const roleAuthorize = require("../midllewares/roleAuth")
const { validateLabo } = require("../midllewares/ValidateLabo")

const router = express.Router();
router.route('/').get(authorize(), roleAuthorize(["employee", "admin", "laboratoire"]), controller.getAll).post(authorize(), roleAuthorize("admin"), validateLabo, controller.create);
router.route('/:id').patch(authorize(), roleAuthorize("admin"), validateLabo, controller.UpdateLabo)
    .delete(authorize(), roleAuthorize("admin"), controller.deleteLabo);
router.route('/ventes').get(authorize(), roleAuthorize(["laboratoire", "admin"]), controller.getVentes);

module.exports = router;