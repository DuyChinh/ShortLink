const bcrypt = require("bcrypt");
const { User, Provider } = require("../models/index");
module.exports = {
  login: (req, res) => {
    const error = req.flash("error");
    res.render("auth/index", { error });
  },

  register: (req, res) => {
    let err="";
    err = req.flash("error");
    return res.render("auth/register", { err });
  },

  handleRegister: async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    const hashPassword = bcrypt.hashSync(password, 10);
    console.log(name);
    if(password != confirmPassword) {
      req.flash("error", "mật khẩu không khớp!");
      return res.redirect("/auth/register");
    }
    await Provider.create({
      name: "email",
    });
    
    await User.create({
      name,
      email,
      password: hashPassword,
      status: true,
    });
    
    return res.redirect("/auth/login");
  },
};
