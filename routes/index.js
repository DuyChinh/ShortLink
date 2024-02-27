var express = require('express');
const sendMail = require('../utils/mail');
var router = express.Router();
const linkController = require("../controllers/link.controller");
const authMiddleware = require("../middlewares/auth.middleware");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { req });
});

router.get("/:id/qrcode", linkController.generateQr);
router.get("/:id", linkController.redirect);
router.post("/:id", linkController.checkPassword);


router.get("/send-mail", async(req, res) => {
  const info = await sendMail('doanchinhit21@gmail.com', 'Xin chào anh An', 'Đố anh biết em là ai');
  res.json(info);
})

module.exports = router;
