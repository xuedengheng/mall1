/**
 * Created by Ben on 2017/1/11.
 */
import React from 'react'
import {Link} from 'react-router'
import {Constant} from 'service'
import styles from './index.scss'

const UNPAID = 'UNPAID';
const UNSEND = 'UNSEND';
const UNTAKE = 'UNTAKE';
const REFUND_PROCESSING = 'REFUND_PROCESSING';

class OrderType extends React.Component {
  state = {
    unpaid: null,
    unsend: null,
    untake: null,
    refunding: null
  }

  componentWillReceiveProps(nextProps) {
    const {statusCount} = nextProps;
    if (statusCount.length > 0) {
      this.setStatusCount(statusCount);
    }
  }

  setStatusCount = statusCount => {
    let unpaid = null;
    let unsend = null;
    let untake = null;
    let refunding = null;
    statusCount.map(status => {
      let {orderCount, orderStatus} = status;
      switch (Constant.getOrderStatusCode(orderStatus)) {
        case UNPAID:
          unpaid = orderCount > 99 ? '99+' : orderCount;
          break;
        case UNSEND:
          unsend = orderCount > 99 ? '99+' : orderCount;
          break;
        case UNTAKE:
          untake = orderCount > 99 ? '99+' : orderCount;
          break;
        case REFUND_PROCESSING:
          refunding = orderCount > 99 ? '99+' : orderCount;
          break;
        default:
          break;
      }
    })
    this.setState({unpaid, unsend, untake, refunding})
  }

  render() {
    const {unpaid, unsend, untake, refunding} = this.state;
    return (
      <div className={styles.root}>
        <Link className={styles.gen} to='mine/order/10?from=mine'>
          <div className={styles.panel}>
            <img src={require('../../../../images/mine/mine_icon_daizhifu.png')} alt=""/>
            <span className={styles.tip}>{unpaid}</span>
          </div>
          <p>待支付</p>
        </Link>
        <Link className={styles.gen} to='mine/order/30?from=mine'>
          <div className={styles.panel}>
            <img src={require('../../../../images/mine/mine_icon_daifahuo.png')} alt=""/>
            <span className={styles.tip}>{unsend}</span>
          </div>
          <p>待发货</p>
        </Link>
        <Link className={styles.gen} to='mine/order/40?from=mine'>
          <div className={styles.panel}>
            <img src={require('../../../../images/mine/mine_icon_daishouhuo.png')} alt=""/>
            <span className={styles.tip}>{untake}</span>
          </div>
          <p>待收货</p>
        </Link>
        {/*<div className={styles.gen}>*/}
        {/*<div className={styles.panel}>*/}
        {/*<img src={require('../../../../images/mine/mine_icon_daipingjia.png')} alt=""/>*/}
        {/*</div>*/}
        {/*<p>待评价</p>*/}
        {/*</div>*/}
        <Link className={styles.gen} to="mine/refund">
          <div className={styles.panel}>
            <img src={require('../../../../images/mine/mine_icon_tuikuan.png')} alt=""/>
            <span className={styles.tip}>{refunding}</span>
          </div>
          <p>退款/售后</p>
        </Link>
      </div>
    )
  }
}

export default OrderType