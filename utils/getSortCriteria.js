const getSortCriteria = (type) => {
  switch (type) {
    case "asc":
      return { price: 1 };
      break;
    case "desc":
      return { price: -1 };
    default:
      return { createAt: -1 };
      break;
  }
};
module.exports = getSortCriteria;
