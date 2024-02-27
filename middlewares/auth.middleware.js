const { Link } = require("../models/index");
module.exports = async(req, res, next) => {
    const pathName = req.baseUrl + req.path;
    // const src = req.headers.host + pathName;
    const code = pathName.split("/")[1];
    // console.log("code", code);
    const link = await Link.findOne({
        where: {
            code,
        }
    });
   

    if (
      req.user ||
      pathName === "/auth/login/google" ||
      pathName === `/${link?.code}/qrcode`||
      pathName === `/${link?.code}` ||
      pathName.includes("google") ||
      pathName.includes("github")

    ) {
      return next();
    }

    if (link && !link.secure) {
      return res.redirect(`${link.root_link}`);
    }

    return res.redirect("/auth/login");
}