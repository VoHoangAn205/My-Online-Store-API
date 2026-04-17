const verifyRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.roles) {
      return res.sendStatus(401);
    }

    const rolesArray = [...allowedRoles];

    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true);

    if (!result)
      return res
        .status(401)
        .json({ message: "you are not authorized to do this action" });
    next();
  };
};

module.exports = verifyRole;
