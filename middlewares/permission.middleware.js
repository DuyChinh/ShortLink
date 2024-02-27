const { User, Role, Permission } = require("../models/index");

module.exports = (permission) => {
    console.log("vào middleware permission");
    return async(req, res, next) => {
        const { id } = req.user;
        const user = await User.findById(id, {
            include: {
                model: Role,
                as: "roles",
                include: {
                    model: Permission,
                    as: "permissions",
                }
            }
        });
        // console.log(user.roles[0].permissions);
        const permissions = [];
        if(user.roles.length) {
            user.roles.forEach((role) => {
                role.permission.forEach((permission) => {
                    !permissions.includes(permission.value) && permissions.push(permission.value);
                });
            })
        }
        console.log(permissions);

        //Kiểm tra 1 quyền cụ thể
        req.can = (value) => {
            return permissions.includes(value);
        }

        if(permissions.includes(permission)) {
            return next();
        }
        return next(new Error("Bạn không có quyền truy cập trang này!"));
    };
};