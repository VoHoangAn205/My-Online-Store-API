const renderHtmlEmailItem = (orders) => {
  return orders
    .map((order) => {
      return order.orderItems
        .map((item) => {
          return `<tr style="border-bottom: 1px solid #f4f5f7;">
                        <td style="padding: 12px 0; color: #333333;">${item.name}</td>
                        <td style="padding: 12px 0; color: #333333; text-align: center;">
                            ${item.quantity}
                        </td>
                        <td style="padding: 12px 0; color: #333333; text-align: right;">
                            ${item.price}
                        </td>
                    </tr>`;
        })
        .join("");
    })
    .join("");
};

module.exports = renderHtmlEmailItem;
