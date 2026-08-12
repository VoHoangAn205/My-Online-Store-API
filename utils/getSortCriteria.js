const getSortCriteria = (type) => {
  switch (type) {
    case "priceAsc":
      return { price: 1 };
      break;
    case "priceDesc":
      return { price: -1 };
      break;
    case "bestSeller":
      return { sold: -1 };
      break;
    default:
      return { createdAt: -1 };
      break;
  }
};
module.exports = getSortCriteria;
