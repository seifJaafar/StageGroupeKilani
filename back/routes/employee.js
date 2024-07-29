const express = require('express');
const controller = require('../controllers/employee');
const multer = require('multer');
const auth = require('../midllewares/auth');
const roleAuthorize = require("../midllewares/roleAuth")

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();
router.route('/upload').post(auth(), roleAuthorize(["employee", "admin"]), upload.single('file'), controller.upload);
router.route('/create').post(auth(), roleAuthorize(["employee", "admin"]), controller.create);
router.route('/references').get(auth(), roleAuthorize(["employee", "admin", "laboratoire"]), controller.GetAllReferences);
router.route('/reference/:refid').get(auth(), roleAuthorize(["employee", "admin", "laboratoire"]), controller.produitByReference);
router.route('/validData').post(auth(), roleAuthorize(["employee", "admin"]), controller.GetValidData);

module.exports = router;