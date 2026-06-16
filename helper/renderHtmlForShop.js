const renderHtmlForShop = (orders) => {
  console.log(orders);
  return orders
    .map((item) => {
      return `<tr style="border-bottom: 1px solid #e1e4e8;">
                        <td style="padding: 12px 10px; color: #333333; font-weight: 500;">${item.name}</td>
                        <td style="padding: 12px 10px; color: #333333; text-align: center; font-weight: bold;">${item.quantity}</td>
                        <td style="padding: 12px 10px; color: #333333; text-align: right;">${item.price}</td>
                    </tr>`;
    })
    .join("");
};

module.exports = renderHtmlForShop;
