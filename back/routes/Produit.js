const express = require('express');
const controller = require('../controllers/Produit');
const authorize = require('../midllewares/auth');
const roleAuthorize = require("../midllewares/roleAuth")
const { validateProduit } = require("../midllewares/ValidateProduit")

const router = express.Router();
router.route('/').get(authorize(), roleAuthorize("admin"), controller.getAll)
    .post(authorize(), roleAuthorize("admin"), validateProduit, controller.create);
router.route('/:id').patch(authorize(), roleAuthorize("admin"), validateProduit, controller.UpdateProduct)
    .delete(authorize(), roleAuthorize("admin"), controller.deleteProduit);
router.route('/byLabo').get(authorize(), roleAuthorize(["laboratoire", "admin"]), controller.getProduitByLabo);

module.exports = router;