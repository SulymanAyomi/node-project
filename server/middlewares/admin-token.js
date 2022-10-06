const verifyToken = require("./verify-token");
module.exports = function (req, res, next) {
  verifyToken(req, res, next, () => {
    if (req.decoded.isStaff || req.decoded.isOwner) {
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "unauthourized user",
      });
    }
  });
};
