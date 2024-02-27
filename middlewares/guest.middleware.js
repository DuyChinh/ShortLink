module.exports = (req, res, next) => {
    const pathName = req.baseUrl + req.path;
  if (req.user && pathName !== "/auth/logout") {
    return res.redirect("/");
  }
  return next();
};
