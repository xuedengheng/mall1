/**
 * Created by Ben on 2017/2/21.
 */
export const DataUtil = {
  emphasisSku(array) {
    let res = [array[0]];
    for (let i = 1; i < array.length; i++) {
      let repeat = false;
      for (let j = 0; j < res.length; j++) {
        if (array[i].title === res[j].title) {
          repeat = true;
          break;
        }
      }
      if (!repeat) {
        res.push(array[i]);
      }
    }
    return res;
  }
}
//skuHandle
export const skuHandle = (data) => {
  if (data) {
    let attributes = [];
    let stocks = [];
    data.attribute.map(item => {
      let attribute = {
        title: item.attrName,
        id: item.attrId,
        childAttr: []
      }
      data.sku.map(child => {
        if (child.attribute.length > 0) {
          child.attribute.map(children => {
            if (children.attrId === item.attrId) {
              attribute.childAttr.push({
                id: children.attrValue,
                title: children.attrValue
              })
            }

          })
        }

      })
      attribute.childAttr = DataUtil.emphasisSku(attribute.childAttr)
      attributes.push(attribute)
    })
    data.sku.map(item => {
      let stock = {
        attribute: [],
        price: parseFloat(item.price),
        originPrice: parseFloat(item.originPrice),
        id: item.skuId,
        picture: item.picture,
        count: parseInt(item.stock),
        activityId: item.activityId,
        activityType: item.activityType
      }
      item.attribute.map(item2 => {
        data.attribute.map(item3 => {
          if (item2.attrId === item3.attrId) {
            stock.attribute.push({
              title: item3.attrName,
              childAttr: {
                title: item2.attrValue,
                id: item2.attrValue
              }
            })
          }
        })
      })
      stocks.push(stock)
    })

    return {attributes, stocks}
  }
}
