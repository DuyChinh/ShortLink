const QRCode = require("qrcode");
const url = require("url");
const { User, Link } = require("../models/index");
const shortid = require("shortid");
const moment = require("moment");
const { where } = require("sequelize");
const Facebook = require("facebook-node-sdk");

module.exports = {
  index: async (req, res) => {
    const { id } = req.user;
    const user_id = id;
    // const links = await Link.findAll();
    const links = await Link.findAll({
      order: [["created_at", "DESC"]],
      where: {
        user_id,
      }
    });
    const success = req.flash("success");
    const defaultLink = req.headers.host;
    const err = req.flash("err");
    res.render("link/index", { success, links, moment, defaultLink, err });
    // res.send("vào");
  },

  handleCompact: async (req, res) => {
    const domain = req.headers.host;
    const { root_link, password, safe_navigation, new_link } = req.body;
    let shortLink = "";
    let codeRandom = "";
    const compare = domain+"/";
    if (new_link !== compare) {
      codeRandom = new_link.split("/")[1];
      const check = await Link.findOne({
        where: {
          compact_link: new_link,
        },
      });
      if (check) {
        req.flash("err", "Link tùy chỉnh đã tồn tại!Vui lòng kiểm tra lại!");
        return res.redirect(req.get("referer"));
      }
      shortLink = new_link;
    } else {
        codeRandom = shortid.generate();
        shortLink = domain + "/" + codeRandom;
    }

    let secure = false;
    if (safe_navigation) {
      secure = true;
    }

    // console.log("handlecCompact", req.user);
    const { id } = req.user;
    const user_id = id;
    // console.log("user_id", user_id);

    await Link.create({
      user_id,
      root_link,
      compact_link: shortLink,
      password,
      secure,
      code: codeRandom,
    });
    req.flash("success", "Rút gọn link thành công!");
    return res.redirect("/link/compactLink");

    // return res.redirect("/link/secure");
  },

  delete: async (req, res) => {
    const { id } = req.params;
    await Link.destroy({ where: { id } });
    req.flash("success", "Xóa thành công!");
    return res.redirect("/link/compactLink");
  },

  redirect: async(req, res) => {
    const { id } = req.params;
    // console.log(id);
    if (id !== "favicon.ico") {
      const link = await Link.findOne({ where: { code: id } });
      const view = link.view + 1;
      await Link.update(
        { view },
        {
          where: {
            code: id,
          },
        }
      );
      if(!link.password) {
        return res.render("link/action", { link });
      }
    //   console.log(link.view);
      
    }
    
    const error = req.flash("error");
    res.render("link/redirect", { error });
  },

  checkPassword: async (req, res) => {
    const { id } = req.params;
    const link = await Link.findOne({
      where: {
        code: id,
      },
    });
   
    const { password } = req.body;
    // console.log(link);
    if (link.password === password) {
      // console.log("vào");
      const rootLink = link.root_link;
      return res.render("link/action", { rootLink, link, req });
    }
    req.flash("error", "Sai mật khẩu!");
    return res.redirect(req.get("referer"));
  },

  generateQr: async(req, res) => {
    const { id } = req.params;
    const link = await Link.findOne({where: {
        code: id,
    }});
    let qr= await QRCode.toDataURL(`${link.root_link}`);
    return res.render("link/qr", { qr });
  },

  

  edit: async(req, res) => {
    const { code } = req.params;
    const { id } = req.user;
    const links = await Link.findAll({
      order: [["created_at", "DESC"]],
      where: {
        user_id: id,
      },
    });
    const linkEdit = await Link.findOne({
      where: {
        code,
      },
    });

    const success = req.flash("success");
    const defaultLink = req.headers.host;
    const err = req.flash("err");
    res.render("link/edit", { success, links, moment, defaultLink, err, linkEdit });
  },

  handleEdit: async(req, res) => {
    const { id } = req.params;
    const { short_link, password } = req.body;
    // console.log(short_link);
    await Link.update(
      { password },
      {
        where: {
          code: id,
        },
      }
    );
    req.flash("success", "Cập nhật thành công!")
    return res.redirect("/link/compactLink");
  }
 
};
