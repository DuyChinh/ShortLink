const model = require("../models/index");
const { isPermission } = require("../utils/permission");
const Role = model.Role;
const Permission = model.Permission;
module.exports = {
  index: async(req, res) => {
    // const error = req.flash("error");
    const roles = await Role.findAll();
  
    const success = req.flash("success");
    return res.render("role/index", { roles, success });
  },

//   addRole: async(req, res) => {
//     await Role.create({name:  req.body.role});
//     return res.redirect("/role");
//   },

  add: (req, res)=> {
    const err = req.flash("error");
    res.render("role/add", {err});
  },

  handleAdd: async(req, res) => {
    const body = req.body;
    const name = body.role;
    let permission = body.permission;
    if (!name) {
      req.flash("error", "Hãy nhập tên role");
      return res.redirect("/role/add");
    }

    const role = await Role.findOne({
      where: { name },
    });
    //1.Thêm table roles --> Kiểm tra trùng lặp
    //2.Thêm table permissions --> Nếu tồn tại permissions lấy permission cũ, ngược lại thêm mới
    //3.Thên table roles_permissions

    if (role) {
      req.flash("error", "Không được bạn ơi. Role đã tồn tại. Hãy đặt tên khác!");
      return res.redirect("/role/add");
    }

    const newRole = await Role.create({
        name,
    });
   
    if (!permission) {
        permission = [];
        req.flash("success", "Thêm role mới thành công!");
        return res.redirect("/role");
    }

    if (!Array.isArray(permission)) {
        permission = [permission];
    }

    const permissions = permission;

    for (const permission of permissions) {
      let permissionValue = await Permission.findOne({
        where: { value: permission },
      });
      if (!permissionValue) {
        permissionValue = await Permission.create({
          value: permission.trim(),
        });
      }
      //Trả về mảng chứa các instance 
      //thêm vào table role_permission
      const newR = await newRole.addPermission(permissionValue);
    //   console.log(newR);
    }
    req.flash("success", "Thêm role mới thành công!");
    return res.redirect("/role");
  },

  deleteRole : async(req, res) => {
    const id = req.params.id;
    // console.log(id);
    // await Role.destroy({
    //   where: {
    //     id: id,
    //   },
    // });
    // req.flash("success", "Delete successful!");
    // return res.redirect("/role");
    const role = await Role.findOne({
      where: { id },
      include: {
        model: Permission,
        as: "permissions",
      },
    });
    if (role) {
      await role.removePermissions(role.permissions);
      await role.destroy();
    }
    req.flash("success", "Delete successful!");
    return res.redirect("/role");
  },

  editRole: async(req, res) => {
    const id = req.params.id;
    // const role = await Role.findByPk(id);
    // console.log(role);
    
    const role = await Role.findByPk(id, {
      include: [
        {
          model: Permission,
          as: "permissions",
        },
      ],
    });
    if (!role) {
      return res.render("role/error");
    }
    const roles = await Role.findAll({ order: [["name", "asc"]] });
    res.render("role/edit", {
      permissions: role.permissions,
      name: role.name,
      roles,
      id,
    });
  },

  handleEditRole: async(req, res) => {
    const body = req.body;
    const name = body.role;
    let permission = body.permission;
    const id = req.params.id;
    console.log(name, permission, id);

    const role = await Role.findByPk(id);
    // console.log(role);
    if(!role) {
        return res.render("role/error");
    }

    if(!permission) {
      await role.setPermissions([]);
      return res.redirect("/role");
    }

    try {

      await Role.update(
        { name: name },
        {
          where : {
            id: id,
          }
        }
      )
    } catch {
      console.log("error update!");
      throw(error);
    }

    if (!Array.isArray(permission)) {
      permission = [permission];
    }
    const permissions = permission;
    console.log("permissions",permissions);

    const permissionArr = [];
    for (const per of permissions) {
      let p = await Permission.findOne({ where: { value: per } });
      if (!p) {
        p = await Permission.create({
          value: per,
        });
      }
      permissionArr.push(p);
    }

    // console.log("permission Arr", permissionArr);
    const newR = await role.setPermissions(permissionArr);
    req.flash("success", "Update role successful!");

    // console.log("setPermission",newR);
    return res.redirect("/role");
  }
};