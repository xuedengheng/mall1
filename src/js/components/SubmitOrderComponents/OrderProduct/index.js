/**
 * Created by Ben on 2017/3/9.
 */
import React, {Component} from 'react';
import styles from './index.scss'
import {Constant} from 'service'

class OrderProduct extends Component {
  render() {
    const {skus, orderSkuDTOs, remarks, setRemark, activityType} = this.props;
    return (
      <div className={styles.root}>
        {
          (skus && orderSkuDTOs) && skus.map((item, index) =>
            <div className={styles.orderWrapper} key={index}>
              <p className={styles.title}>
                <span className="font-28">{item.storeName}发货</span>
              </p>
              <div className={styles.productWrapper}>
                <ul>
                  {
                    item.skuPrices.map((sku, i) =>
                      <li className={styles.itemWrapper} key={i}>
                        <div className={styles.icon}>
                          <div className={styles.imgWrapper}>
                            <img src={sku.picture} alt=""/>
                          </div>
                        </div>
                        <div className={styles.detail}>
                          <p className={`font-26 color333 text-overflow-one ${styles.name}`}><span className="color-fe5">{activityType ? Constant.getActivityName(activityType) : ''}</span>{sku.name}</p>
                          <p className={`font-24 color8282 text-overflow-one ${styles.attr}`}>
                            规格：{sku.selectedAttr}</p>
                          <p>
                            <span className="font-20">¥  </span>
                            <span className="font-30">
                                                            {orderSkuDTOs[index].skuPrices[i].payPrice}
                                                        </span>
                            {
                              parseFloat(orderSkuDTOs[index].skuPrices[i].payPrice) < parseFloat(orderSkuDTOs[index].skuPrices[i].price) &&
                              <s className="font-28 color8282 ml10">{orderSkuDTOs[index].skuPrices[i].price}</s>
                            }

                          </p>
                        </div>
                        <div className={styles.quantity}>
                          <span>×{sku.quantity}</span>
                        </div>
                      </li>
                    )
                  }
                </ul>
              </div>
              <div className={styles.bottomWrapper}>
                <p className={`cf ${styles.freight}`}>
                  <span className="fl font-28">运费</span>
                  <span className="fr font-28">¥{orderSkuDTOs[index].freight}</span>
                </p>
                <p className={styles.wordsWrapper}>
                  <span className="font-28">买家留言</span>
                  <input value={remarks.length > 0 ? remarks[index] : ''} type="text" name="words"
                         placeholder="有什么要求通通告诉我们吧！"
                         onChange={setRemark.bind(this, index)}/>
                </p>
              </div>
            </div>
          )
        }
      </div>
    )
  }
}
export default OrderProduct