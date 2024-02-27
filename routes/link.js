var express = require("express");
var router = express.Router();
const linkController = require("../controllers/link.controller");

router.get("/compactLink", linkController.index);
router.post("/compactLink", linkController.handleCompact);

router.post("/delete/:id", linkController.delete);

router.get("/edit/:code", linkController.edit);
router.post("/edit/:id", linkController.handleEdit);


module.exports = router;
