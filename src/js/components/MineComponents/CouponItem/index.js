/**
 * Created by HEro on 2017/6/5.
 */
import React, {Component} from 'react'
import Swipeable from 'react-swipeable'
import {dateUtil} from 'service'
import styles from './index.scss';

class CouponItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      openIntro: false,
      showDel: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hasRefresh) {
      this.setState({openIntro: false, showDel: false})
      return;
    }
    if (this.props.couponId === nextProps.couponId && this.state.showDel) {
      return;
    }

    if (this.props.couponId && this.state.showDel) {
      this.setState({showDel: false})
    }
  }

  showDes = () => {
    if (this.state.showDel) {
      this.setState({showDel: false})
    }
    const {openIntro} = this.state;
    this.setState({openIntro: !openIntro})
  }

  deleteCoupon = () => {
    if (!this.state.showDel) {
      return;
    }
    this.props.onDel();
  }

  swipedLeft = () => {
    const {mode, coupon} = this.props;
    if (mode === 'edit' && (coupon.status === 'EXPIRED' || coupon.status === 'USED')) {
      this.setState({showDel: true})
    }
  }

  swipedRight = () => {
    const {mode} = this.props
    if (mode === 'edit') {
      this.setState({showDel: false})
    }
  }

  selectCoupon = () => {
    if (this.state.showDel) {
      this.setState({showDel: false})
      return;
    }
    if (this.props.mode === 'submit' && this.props.coupon.available === 'Y') {
      this.props.onSelect()
    }
  }

  render() {
    const {mode, coupon, checked, index, couponClick} = this.props;
    const {openIntro, showDel} = this.state;
    return (
      <Swipeable className={`${styles.list}`}
                 onSwipedLeft={this.swipedLeft.bind(this, coupon.id)}
                 onSwipedRight={this.swipedRight.bind(this, coupon.id)}>
        <div className={styles.couponlist}
             style={{transform: showDel ? 'translateX(-1.4rem)' : 'translateX(0)'}}>
          <div onTouchStart={couponClick}>
            <div onClick={this.selectCoupon.bind(this)}
                 className={`${styles.coupontop} ${coupon.status === 'EXPIRED' || (mode === 'submit' && coupon.available === 'N')
                   ? styles.unuseful : styles.useful}`}>
              <div className={`text-overflow-1 ${styles.couponcontent}`}>
                <p className={styles.couponname}>{coupon.name}</p>
                <p className={styles.coupontime}>
                  有效期：{
                  coupon.legalType === 'BY_DAYS' ?
                    `${dateUtil.turnToCoupon(dateUtil.getDate(coupon.adoptedDate))}
                                至${dateUtil.turnToCoupon(dateUtil.getDate(coupon.expiredDate))}`
                    : `${dateUtil.turnToCoupon(dateUtil.getDate(coupon.legalStart))}
                                至${dateUtil.turnToCoupon(dateUtil.getDate(coupon.legalEnd))}`}
                </p>
              </div>
              {
                mode === 'edit' && coupon.status === 'ADOPTED' &&
                <a href={coupon.linkRef ? coupon.linkRef : '' } className={styles.couponuse}>
                  <span className={styles.use}>立即使用</span>
                  <img
                    src={require('../../../../images/mine/coupon/youhuiquan_lijishiyong.png')}/>
                </a>
              }
              {
                mode === 'submit' && coupon.available && coupon.available === 'Y' &&
                <div>
                  {
                    checked === index ?
                      <img src={require('../../../../images/submit_order/youhuiquan_xuanzhong-.png')} alt=""/>
                      :
                      <img src={require('../../../../images/submit_order/youhuiquan_weixuanzhong-.png')} alt=""/>
                  }
                </div>
              }
            </div>
            <div onClick={this.showDes.bind(this, coupon.id)} className={styles.couponbottom}>
              <div className={styles.coupondescription}>
                <p className={`${!openIntro ? 'text-overflow-1' : ''}`}>{coupon.description}</p>
              </div>
              <div className={`${ !openIntro ? `${styles.trans0}` :
                `${styles.trans180}`} ${styles.coupondown}`}>
                <img src={require('../../../../images/mine/coupon/youhuiquan_xia.png')} alt=""/>
              </div>
            </div>
          </div>
          {mode === 'edit' && (coupon.status === 'USED' || coupon.status === 'EXPIRED') &&
          <div className={styles.delbox} onClick={this.deleteCoupon.bind(this, coupon.id)}>
            <div className={styles.delicon}></div>
          </div>
          }

        </div>
      </Swipeable>
    )
  }

}

export default CouponItem;