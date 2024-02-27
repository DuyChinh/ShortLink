const model = require("../models/index");
const moment = require("moment");
const User = model.User;


const { Op } = require("sequelize");
module.exports = {
  index: async (req, res) => {
    const msg = req.flash("success");
    res.render("users/index", { users, moment, msg});
  },


  delete: async(req, res) => {
    const {id} = req.params;
    const status = await User.destroy({ 
      where: {id},
      // force: true, 
      /*xóa vĩnh viễn */
    });
    res.redirect("/users");
  },

  addPermission: async(req, res) => {
    const id = req.params.id;
    const user = await User.findByPk(id, {
      include: [
        {
          model: Role,
          as: "roles",
        },
      ],
    });
    const userRoles = user.roles;
    const roles = await Role.findAll();
    res.render("users/permission", { roles, userRoles });
  }, 

  handleAddPermission: async(req, res) => {
    const id = req.params.id;
    const body = req.body;
    let roles = body.role;
    // console.log("roles", roles);
    if(!roles) {
      roles=[];
    }
    if(!Array.isArray(roles)) {
      roles = [roles];
    }
    const user = await User.findByPk(id);
    let roleArr =[];
    for(role of roles) {
      const newRole = await Role.findByPk(role);
      roleArr.push(newRole);
    }
    await user.setRoles(roleArr);
    req.flash("success", `Cập nhật role cho ${user.name} thành công!`);
    return res.redirect("/users");
  }

  
};