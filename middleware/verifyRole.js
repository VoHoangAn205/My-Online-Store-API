const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.roles) {
      return res.sendStatus(401);
    }

    const rolesArray = [...allowedRoles];

    const hasPermission = req.roles.some((role) => rolesArray.includes(role));

    if (!hasPermission) {
      return res
        .status(403)
        .json({ message: "You are not authorized to perform this action" });
    }
    next();
  };
};

module.exports = verifyRole;
