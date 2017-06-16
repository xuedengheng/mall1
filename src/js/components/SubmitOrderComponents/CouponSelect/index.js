/**
 * Created by Ben on 2017/5/16.
 */
import React from 'react'
import styles from './index.scss'
import {dateUtil} from 'service'
import {CouponItem,SetHelmet} from 'components'
import {hashHistory} from 'react-router'
const BY_RANGE = 'BY_RANGE';
const BY_DAYS = 'BY_DAYS';

class CouponSelect extends React.Component {
  constructor(props) {
    super(props);
    this.animationEnd = this.animationEnd.bind(this);
    this.state = {
      isShow: false,
      animationType: 'leave',
      checked: -1,
      init:false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.enter();
    } else if (this.props.visible && !nextProps.visible) {
      this.leave();
    }
  }

  enter() {
    this.setState({
      isShow: true,
      animationType: 'enter'
    });
  }

  leave() {
    this.setState({
      animationType: 'leave'
    })
  }

  animationEnd() {
    if (this.state.animationType === 'leave') {
      this.setState({
        isShow: false,
      });
    }
  }

  _handleSelect = (coupon, checked) => {
    this.setState({checked,init:true});
    this.props.handleSelect(coupon)
  }

  _handleNouse = () => {
    this.setState({checked: -1,init:true});
    this.props.handleNouse()
  }

  toRule = () => {
    hashHistory.push(`/lnk?url=${encodeURIComponent('http://cdn.9yiwu.com/H5/Rule/coupon_rule.html')}&title=优惠券规则`);
  }

  render() {
    const {usableCoupon, unusableCoupon, close} = this.props;
    const {isShow, animationType, checked,init} = this.state;
    const style = {
      display: isShow ? '' : 'none',
      WebkitAnimationDuration: '300ms',
      animationDuration: '300ms'
    }
    return (
      <div className={`fixed-top ${styles.root} rodal-popleft-${animationType}`} style={style}
           onAnimationEnd={this.animationEnd}>
        <div className={styles.header}>
          <div className={`fixed-top ver-center border-bottom ${styles.content}`}>
            <div className={`ver-center ${styles.back}`} onClick={close}>
              <img src={require('../../../../images/base/search_icon_back.png')} alt=""/>
            </div>
            <p className="text-center font-32 text-overflow-1">
              选择优惠券
            </p>
            <div onClick={this.toRule.bind(this)} className={`ver-center ${styles.question}`}>
              <img src={require('../../../../images/submit_order/youhuiquan_wenhao.png')} alt=""/>
            </div>
          </div>
        </div>
        <div className={styles.couponlistwrapper}>
          {
            usableCoupon && usableCoupon.map((item, index) => {
                return (
                  <CouponItem onSelect={this._handleSelect.bind(this, item, index)} hasRefresh={init}
                              key={index} index={index} checked={checked} coupon={item} mode="submit"></CouponItem>
                )
              }
            )
          }
          {
            unusableCoupon.length > 0 ?
              <div>
                <p className={styles.message}>以下优惠券暂不可用</p>
                {
                  unusableCoupon.map((item, index) => {
                      return (
                        <CouponItem key={index} coupon={item}  hasRefresh={init} mode="submit"></CouponItem>
                      )
                    }
                  )
                }
              </div> : null
          }
        </div>
        <div className={styles.cancelbtnwrapper} onClick={this._handleNouse.bind(this)}>
          <div className={styles.cancelbtn}>
            <span className="font-28 color-fe5">不使用优惠券</span>
          </div>
        </div>
        <div className={styles.bottomB}></div>

      </div>
    )
  }
}

export default CouponSelect