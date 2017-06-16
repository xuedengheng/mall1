/**
 * Created by Ben on 2017/3/17.
 */
import React, {Component} from 'react'
import styles from './index.scss'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Toast} from 'antd-mobile';
import {hashHistory, Lifecycle} from 'react-router'
import reactMixin from 'react-mixin'
import * as PayActions from 'actions/PayActions'
import {fetchApi, urlApi, getQueryString, Constant} from 'service'
import {
  GoBack,
  FooterBox,
  SplitLine,
  Loading,
  ConfirmModal,
  SetHelmet
} from 'components'

const TYPE = [
  {
    type: Constant.WAY_WX,
    name: '微信支付',
    description: '需安装微信客户端',
    check: false,
    icon: require('../../../images/submit_order/pay_icon_payment_wechat.png')
  },
  {
    type: Constant.WAY_FM,
    name: '飞马支付',
    description: '需安装飞马钱包客户端',
    check: false,
    icon: require('../../../images/submit_order/pay_icon_payment_feima.png')
  },
  {
    type: Constant.WAY_YW,
    name: '易点支付',
    description: '可用余额',
    check: false,
    icon: require('../../../images/submit_order/pay_icon_payment_yidian.png')
  }
]

const CancelTips = {
  tips: '您确定放弃支付吗？',
  confirmBtnText: '放弃支付',
  cancelBtnText: '考虑一下'
}

@reactMixin.decorate(Lifecycle)
class PayOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPaid: false,
      visible: false,
      isDiscounted: false,
      type: TYPE,
      payWay: null,
      totalAmount: 0.00,
      unionPayFlag: 'union',
      tradeType: 'APP',
      orderJnId: null,
      orderDetail: null,
      orderDate: null,
      orderTime: null,
      token: null,
      openid: localStorage.openId ? localStorage.openId : ''
    }
    this.routerWillLeave = this.routerWillLeave.bind(this)
  }

  routerWillLeave(nextLocation) {
    const {isPaid} = this.state;
    if (!isPaid) {
      hashHistory.goForward();
      this.setState({visible: true});
      return false
    }
  }

  onCancel = () => {
    this.setState({visible: false, isPaid: false})
  }

  onConfirm = () => {
    const {query} = this.props.location;
    this.setState({visible: false, isPaid: true});
    setTimeout(() => {
      if (query.from && query.from === 'order') {
        hashHistory.goBack()
      } else if (query.mode) {
        if (query.mode === 'submit') {
          hashHistory.replace('/mine/order/1000?from=pay')
        } else {
          hashHistory.replace(`/mine/order/order_detail/${query.id}?from=pay`)
        }
      }
    }, 300)
  }

  componentWillMount() {
    this.props.payActions.getYiwuCoin();
  }

  componentDidMount() {
    let query = this.props.params.data;

    if (query) {
      let data = JSON.parse(query);
      let {orderDetail, orderJnId, totalAmount, isDiscounted} = data;
      this.setState({
        orderDetail: JSON.stringify(orderDetail),
        orderJnId,
        totalAmount,
        isDiscounted: isDiscounted === 'Y'
      })
    }
  }

  componentWillUnmount() {
    this.state.type.forEach(item => {
      item.check = false;
    })
  }

  selectType = (status) => {
    let {type} = this.state;
    type.forEach(item => {
      if (item.type === status) {
        item.check = true
      } else {
        item.check = false
      }
    })
    this.setState({type, payWay: status})
  }

  pay = (ywCoin) => {
    const {
      totalAmount,
      tradeType,
      orderJnId,
      orderDetail,
      payWay
    } = this.state;
    if (!payWay) {
      return;
    }
    if (payWay === Constant.WAY_YW && parseFloat(ywCoin) < parseFloat(totalAmount)) {
      Toast.info('您的账户余额不足');
    } else {
      this.props.payActions.choosePayWay({mobilePhone: localStorage.account, orderDetail, orderJnId, payWay, tradeType})
      this.setState({isPaid: true})
    }
  }

  render() {
    const {ywCoin} = this.props;
    const {type, totalAmount, payWay, visible, isDiscounted, isPaid} = this.state;
    return (
      <div>
        <SetHelmet title="选择支付方式"/>
        {
          this.props.isFetching && <Loading />
        }
        <GoBack name="选择支付方式"/>
        <SplitLine />
        <div className={`cf ${styles.totalCount}`}>
          <span className="fl font-26">订单金额</span>
          <span className="fr font-26 color-fe5">¥{parseFloat(totalAmount).toFixed(2)}</span>
        </div>
        <SplitLine />
        <div className={styles.payWrapper}>
          <ul>
            {
              type.map((item, index) =>
                ((isDiscounted && item.type !== Constant.WAY_YW) || !isDiscounted) &&
                <li className={styles.type} key={index} onClick={this.selectType.bind(this, item.type)}>
                  <div className={styles.checkbox}>
                    {
                      item.check ?
                        <img src={require('../../../images/cart/car_icon_check_yes.png')}
                             alt=""/>
                        :
                        <img src={require('../../../images/cart/car_icon_check_no.png')}
                             alt=""/>
                    }
                  </div>
                  <div className={styles.content}>
                    <div className={styles.icon}>
                      <img src={item.icon} alt=""/>
                    </div>
                    <div className={styles.detail}>
                      <p className={styles.name}>{item.name}</p>
                      <p
                        className={styles.description}>{item.description}{item.type === Constant.WAY_YW && ywCoin && parseFloat(ywCoin).toFixed(2)}</p>
                    </div>
                  </div>
                </li>
              )
            }
          </ul>
        </div>
        <FooterBox name="立即支付" handleClick={this.pay.bind(this, ywCoin)} pClass={payWay ? '' : 'opacity50'}/>
        <ConfirmModal
          visible={visible}
          tips={CancelTips.tips}
          subTips={CancelTips.subTips}
          confirmBtnText={CancelTips.confirmBtnText}
          cancelBtnText={CancelTips.cancelBtnText}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm.bind(this)}/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.pay.isFetching,
  ywCoin: state.pay.ywCoin,
})

const mapDispatchToProps = dispatch => ({
  payActions: bindActionCreators(PayActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PayOrder)