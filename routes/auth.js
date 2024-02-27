var express = require('express');

var router = express.Router();
const authController = require("../controllers/auth.controller")

router.get("/register", authController.register);
router.post("/register", authController.handleRegister);


router.get("/login", authController.login);
const passport = require("passport");

router.post("/login",passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: true,
    successRedirect: "/",
  }),
);

router.get("/github/redirect", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    failureRedirect: "/auth/login",
    failureMessage: true,
    successRedirect: "/",
  })
);

router.get("/google/redirect", passport.authenticate("google"));

router.get(
  "/google/callback",
    passport.authenticate("google", {
      failureRedirect: "/auth/login",
      failureMessage: true,
      successRedirect: "/",
    }),
);

router.get("/logout", (req, res) => {
    req.logout((err) => {});
    return res.redirect("/auth/login");
});




module.exports = router;
