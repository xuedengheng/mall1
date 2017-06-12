import React, {Component} from 'react'
import _ from 'lodash'
import {GoBack, Loading, OnSale, SetHelmet, ConfirmModal, LazyLoadComponent, Contact} from 'components'
import styles from './index.scss'
import {connect} from 'react-redux'
import {Link, hashHistory} from 'react-router'
import {Toast, Popup} from 'antd-mobile';
import {bindActionCreators} from 'redux'
import {OrderStatus, api, Constant, urlApi, fetchApi} from 'service';
import * as OrderActions from 'actions/OrderActions'


//申明状态
const CANCEL = 'CANCEL';
const EXTENDED = 'EXTENDED';
const CONFIRM = 'CONFIRM';

//定义Model内容
const CancelTips = {
  tips: ' 确认取消订单？',
  subTips: '是否放弃支付该笔订单',
  cancelBtnText: '考虑一下',
  confirmBtnText: '放弃支付'
}
const ExtendedTips = {
  tips: '确认延长收货？',
  subTips: '确认后收货时间将延长至15天'
}
const confirmTips = {
  tips: '确认收到货物？',
  subTips: '请确认您已收到该笔订单内所有商品',
  confirmBtnText: '确认收货'
}


class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.timer = [];
    this.state = {
      orderId: props.params.orderId,
      orderStatus: props.params.orderStatus,
      visible: false,
      min: 0,
      sec: 0,
      interval: [],
      time: null,
      deadtime: null,
      modalStatus: null,
      parcelId: null,
      isShow: true
    }
  }

  componentDidMount() {
    const {orderId} = this.props.params;
    this.props.orderActions.queryNowTime();
    this.props.orderActions.queryOrderDetail(orderId);
    window.scroll(0, 0);
  }

  componentWillReceiveProps(nextProps) {
    const {time, deadtime, orderStatus} = nextProps;
    if (orderStatus && orderStatus === '10') {
      this.Time(time);
    } else if (orderStatus && orderStatus === '30') {
      this.DeadTime(deadtime);
    }
  }

  componentWillUnmount() {
    this.clearTimer();
    this.props.orderActions.clearOrderDetail();
  }

  clearTimer = () => {
    if (this.timer && this.timer.length) {
      this.timer.map(time => {
        clearInterval(time)
      })
    } else {
      this.timer && clearInterval(this.timer)
    }
  }

  //分秒倒计时
  Time = (time) => {
    const {nowTime} = this.props;
    this.clearTimer();
    if (nowTime && time) {
      let exprieTime = new Date(time.replace(/-/g, '/')).getTime();
      let nowDay = new Date(nowTime.replace(/-/g, '/')).getTime();
      let PassTime = exprieTime - nowDay;
      let lastScond = parseInt(PassTime / 1000, 10);//计算剩余的秒数
      if (lastScond > 0 ) {
        this.timer = setInterval(() => {
          lastScond --;
          this.setState({
            min: parseInt(lastScond / 60),
            sec: lastScond % 60,
          });
          if (lastScond <= 0) {
            clearInterval(this.timer);
            this.setState({min: 0, sec: 0,});
            const {orderId} = this.props.params;
            this.props.orderActions.queryOrderDetail(orderId);
          }
        }, 1000);
      }
    }
  }


  //给每个商品添加天时分秒倒计时
  DeadTime = (deadtime) => {
    this.clearTimer();
    deadtime && deadtime.map((item, index) => {
      if (item.deadtime !== undefined) {
        this.timer[index] = setInterval(() => {
          let interval = this.state.interval;
          let endTime = new Date(item.deadtime.replace(/-/g, '/')).getTime();
          let now = new Date().getTime();
          let leftTime = endTime - now;
          interval[index] = {
            day: parseInt(leftTime / 1000 / 60 / 60 / 24, 10),//计算剩余的天数
            hour: parseInt(leftTime / 1000 / 60 / 60 % 24, 10),//计算剩余的小时数
            Bmin: parseInt(leftTime / 1000 / 60 % 60, 10),//计算剩余的分钟数
          }
          this.setState({
            interval
          });
          if (leftTime <= 0) {
            clearInterval(this.timer[index]);
          }
        }, 1000);
      }
    })
  }

  cancelOrderClick = (orderId) => {
    this.setState({
      modalStatus: CANCEL,
      orderId
    })
    this.props.orderActions.openConfirmModal();
  }

  ExtendedOrderClick = (parcelId) => {
    this.setState({
      modalStatus: EXTENDED,
      parcelId
    })
    this.props.orderActions.openConfirmModal();
  }

  ConfirmReceiptOrderClick = (parcelId) => {
    this.setState({
      modalStatus: CONFIRM,
      parcelId
    })
    this.props.orderActions.openConfirmModal();
  }

  onCancel = () => {
    this.props.orderActions.closeConfirmModal();
  }

  onConfirm = () => {
    const {modalStatus, orderId, parcelId, orderStatus} = this.state;
    if (modalStatus === CANCEL) {
      this.props.orderActions.cancelOrder(orderStatus, orderId);
    } else if (modalStatus === EXTENDED) {
      this.props.orderActions.extendedOrder(orderId, parcelId);
    } else if (modalStatus === CONFIRM) {
      this.props.orderActions.confirmOrder(orderId, parcelId);
    }
  }

  //提醒发货
  RemindDelivery = () => {
    Toast.info('提醒发货成功！');
  }
  //提醒配货
  RemindDistribution = () => {
    Toast.info('提醒配货成功！');
  }

  //立即支付
  nowPayClick = orderInfo => {
    const {nowTime, time} = this.props;
    let createTime = new Date(time.replace(/-/g, '/')).getTime();
    let nowDay = new Date(nowTime.replace(/-/g, '/')).getTime();
    let PassTime = nowDay - createTime;
    let lastScond = parseInt(PassTime / 1000, 10);//计算剩余的秒数
    if (lastScond <= 0) {
      Toast.info('您的支付时间已超时，请重新下单');
      const {orderId} = this.props.params;
      this.props.orderActions.queryOrderDetail(orderId);
    } else {
      let data = {
        orderDetail: [{orderId: orderInfo.orderId}],
        orderJnId: orderInfo.orderJnId,
        totalAmount: orderInfo.payAmount,
        isDiscounted: orderInfo.isDiscounted
      }
      hashHistory.push({
        pathname: `/pay_order/${JSON.stringify(data)}`,
        search: `?from=order`
      })
    }
  }

  setStatusValue = (postPurchasedStatus, status) => {
    if (postPurchasedStatus) {
      return Constant.getDetailStatus(postPurchasedStatus);
    } else {
      switch (status) {
        case "30" :
          return '申请退款'
        case "40" :
          return '申请退款'
        case "60" :
          return '申请售后'
        default:
          return null
      }
    }
  }

  setStatusPayTime = (payDate, payTime) => {
    if (payDate) {
      let str = payDate.toString();
      let year = str.substr(0, 4);
      let month = str.substr(4, 2);
      let date = str.substr(6, 2);
      let PayDate = year + '-' + month + '-' + date;
      if (payTime) {
        let test = payTime.toString();
        let hour = test.substr(0, 2);
        let mim = test.substr(2, 2);
        let sec = test.substr(4, 2);
        let PayTime = hour + ':' + mim + ':' + sec;
        return PayDate + '  ' + PayTime;
      }
    }
  }


  _setTips = (modalStatus) => {
    switch (modalStatus) {
      case 'CANCEL':
        return CancelTips;
      case 'EXTENDED':
        return ExtendedTips;
      case 'CONFIRM':
        return confirmTips;
      default:
        return {}
    }
  }


  render() {
    const {palceldetail, isFetching, visible} = this.props;
    const {interval, modalStatus, isShow} = this.state;
    const style = {
      display: isShow ? '' : 'none',
    }
    const TIPS = this._setTips(modalStatus);

    return (
      <div>
        {
          isFetching && <Loading />
        }
        <SetHelmet title="订单详情"/>
        <GoBack name="订单详情" bottom="true"/>
        <ConfirmModal
          visible={visible}
          tips={TIPS.tips}
          subTips={TIPS.subTips}
          downTips={TIPS.downTips}
          confirmBtnText={TIPS.confirmBtnText}
          cancelBtnText={TIPS.cancelBtnText}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm.bind(this)}/>

        <div className={styles.Odetails}>
          <p className={styles.title}>{palceldetail.storeName}发货</p>
          <p className={styles.Time} style={style}>{palceldetail.orderStatus === '10' ?
            <em>{this.state.min}分{this.state.sec}秒后关闭订单</em> : null }</p>
        </div>
        <div className={styles.allA}>
          <div className={styles.adressMsg}>
            <p className={styles.adressImg}>
              <img src={require("../../../../../images/order/Address.png")} alt=""/>
            </p>
            <p className={styles.adressMsg}>
              <span className={styles.rightname}>
                  <em>收货人：<span>{palceldetail.contactsName}</span></em>
                  <em>{palceldetail.contactsMobile}</em>
              </span>
              <span className={styles.DetailAdr}>收货地址：<em>{palceldetail.contactsProvince}</em>&nbsp;
                <em>{palceldetail.contactsCity}</em>&nbsp;<em>{palceldetail.contactsBlock}</em>&nbsp;
                <em>{palceldetail.contactsStreet}</em>&nbsp;
                <em>{palceldetail.contactsAddress}</em></span>
            </p>
          </div>
        </div>
        <div className={styles.allDown}>
          {
            palceldetail.remark === '' ?
              null
              :
              <div className={styles.adressDown}>
                <p className={styles.MImg}>
                  <img src={require("../../../../../images/order/message.png")} alt=""/>
                </p>
                <p className={styles.MMsg}>
                  <span className={styles.rightname}>买家留言</span>
                  <span className={styles.DetailAdr}>{palceldetail.remark}</span>
                </p>
              </div>
          }
        </div>
        {
          palceldetail.parcelList && palceldetail.parcelList.map((goods, index) => {
              return (
                <div className={styles.bags} key={index}>
                  <p className={styles.title}>
                    <span className={styles.Bnum}>包裹{index + 1}</span>
                    <span className={styles.getparce}>
                      {
                        (goods.status === '40' && interval[index]) ?
                          <em
                            className={styles.timer}>{interval[index].day}天{interval[index].hour}时{interval[index].Bmin}分后自动收货<em
                            className={styles.timer}>{goods.isDelayedReceive === 'Y' ? ',已延长' : null }</em></em>
                          : null
                      }
                    </span>
                    <span className={styles.Badress}>{Constant.getOrderStatus(goods.status)}</span>
                  </p>
                  <div className={styles.order}>
                    <ul className="Bul">
                      {
                        goods.orderDetailList && goods.orderDetailList.map((detail, index) => {
                          return (
                            <div className={styles.bigtop} key={index}>
                              <Link to={`/product/${detail.productId}`}>
                                <li className="Bli">
                                  <div className={styles.goods}>
                                    <p className={styles.Detail}>
                                      <span className={styles.pic}>
                                           <img src={detail.picture} alt=""/>
                                      </span>
                                      <span className={styles.Sname}>
                                         <em className={styles.name}>
                                           <span
                                             className={`text-overflow-one ${styles.longdetails}`}>
                                             {detail.activityType &&
                                             <span className={`color-fe5`}>
                                                    {Constant.changeActivity(detail.activityType)}
                                                    </span>}
                                             {detail.productName}
                                           </span>
                                           <span className={styles.quantity}>X{detail.quantity}</span>
                                         </em>
                                         <em
                                           className={`text-overflow-one ${styles.Num}`}>规格：{detail.productAttr}</em>
                                         <em className={styles.price}>
                                             <em className={styles.pricetotle}>
                                                  <em>￥{detail.payPrice}</em>&nbsp;&nbsp;
                                               {
                                                 palceldetail.isDiscounted === 'Y' ?
                                                   <em className={styles.originalprice}>￥{detail.price}</em>
                                                   :
                                                   null
                                               }
                                             </em>
                                         </em>
                                    </span>
                                    </p>
                                  </div>
                                </li>
                              </Link>
                              {
                                detail.canRefund === 'Y' ?
                                  <div>
                                    {
                                      !detail.postPurchasedStatus ?
                                        <Link
                                          to={`/mine/applyrefund/${JSON.stringify({
                                            orderId: goods.orderId,
                                            quantity: detail.quantity,
                                            payPrice: detail.payPrice,
                                            skuId: detail.skuId,
                                            storeId: detail.storeId
                                          })}`}>
                                          <em
                                            onClick={this.ApplyForRefund}
                                            className={styles.refundfont}>{this.setStatusValue(detail.postPurchasedStatus, goods.status)}</em>
                                        </Link> :
                                        <Link
                                          to={`/mine/refund/${JSON.stringify({
                                            orderId: goods.orderId,
                                            skuId: detail.skuId
                                          })}`}>
                                          <em
                                            onClick={this.ApplyForRefund}
                                            className={styles.refundfont}>{this.setStatusValue(detail.postPurchasedStatus, goods.status)}</em>
                                        </Link>
                                    }
                                  </div>
                                  : null
                              }
                            </div>
                          )
                        })
                      }
                    </ul>
                  </div>
                  {
                    goods.status === "10" || goods.status === "90" ?
                      null
                      :
                      <div>
                        {
                          goods.status === "60" ?
                            <div>
                              {
                                goods.expressNum ?
                                  <p className={styles.footer}>
                                      <span className={styles.btn}>
                                          {
                                            palceldetail.storeId === 'JD' ?
                                              <Link
                                                to={`/mine/express/${goods.expressCorp}/${goods.expressNum}`}>
                                                <button
                                                  className={styles.FButn}>
                                                  查看物流
                                                </button>
                                              </Link>
                                              :
                                              <a
                                                href={`https://m.kuaidi100.com/index_all.html?type=${Constant.getExpressType(goods.expressCorp)}&postid=${goods.expressNum}`}>
                                                <button
                                                  className={styles.FButn}>
                                                  查看物流
                                                </button>
                                              </a>
                                          }
                                      </span>
                                  </p>
                                  :
                                  null
                              }
                            </div>
                            :
                            <p className={styles.footer}>
                              <span className={styles.btn}>
                                {
                                  goods.status === "30" ?
                                    <span>
                                       <button className={styles.SButn}
                                               onClick={this.RemindDelivery}>提醒发货</button>
                                    </span>
                                    :
                                    <span>
                                          {
                                            goods.status === "20" ?
                                              <span>
                                                   <button
                                                     className={styles.SButn}
                                                     onClick={this.RemindDistribution}>提醒配货</button>
                                              </span>
                                              :
                                              <span>
                                                {
                                                  goods.isDelayedReceive === 'Y' ?
                                                    null
                                                    :
                                                    <button
                                                      className={styles.FButn}
                                                      onClick={this.ExtendedOrderClick.bind(this, goods.parcelId)}>
                                                      延长收货</button>
                                                }
                                                {
                                                  goods.expressCorp === 'JD' ?
                                                    <Link
                                                      to={`/mine/express/${goods.expressCorp}/${goods.expressNum}`}>
                                                      <button
                                                        className={styles.FButn}>
                                                        查看物流
                                                      </button>
                                                    </Link>
                                                    :
                                                    <a
                                                      href={`https://m.kuaidi100.com/index_all.html?type=${Constant.getExpressType(goods.expressCorp)}&postid=${goods.expressNum}`}>
                                                      <button
                                                        className={styles.FButn}>
                                                        查看物流
                                                      </button>
                                                    </a>
                                                }
                                                <button
                                                  className={styles.SButn}
                                                  onClick={this.ConfirmReceiptOrderClick.bind(this, goods.parcelId)}>确认收货</button>
                                              </span>
                                          }
                                    </span>
                                }
                              </span>
                            </p>
                        }
                      </div>

                  }
                </div>
              )
            }
          )
        }
        <div className={styles.Ncash}>
          <div className={styles.firsttotle}>
            <p className={styles.firstdetails}>
              <span>商品总计</span>
              <span>￥{palceldetail.amount}</span>
            </p>
            {
              palceldetail.discount === '0.00' ?
                null
                :
                <p className={styles.firstdetails}>
                  <span>优惠总计</span>
                  <span>-￥{palceldetail.discount}</span>
                </p>
            }
            {
              palceldetail.couponDiscount === '0.00' ?
                null
                :
                <p className={styles.firstdetails}>
                  <span>优惠券</span>
                  <span>-￥{palceldetail.couponDiscount}</span>
                </p>
            }
            <p className={styles.Sdetails}>
              <span>运费</span>
              <span>￥{palceldetail.freight}</span>
            </p>
          </div>
          <p className={styles.truePay}>
            <span>实付</span>
            <span>￥{palceldetail.payAmount}</span>
          </p>
        </div>
        {
          palceldetail.orderStatus === "10" || palceldetail.orderStatus === "90" ?
            <div>
              <div className={styles.Dtotle}>
                <p className={styles.Dtitle} onClick={contact}>
                  <span className={styles.Fimg}><img src={require("../../../../../images/order/Customer-service.png")}
                                                     alt=""/>联系客服</span>
                  <span className={styles.Simg}>
                    <img src={require("../../../../../images/order/left_arrow.png")} alt=""/>
                  </span>
                </p>
                <div className={styles.footerBtn}>
                  <div className={styles.Dlast}>
                    <li className={styles.Dlist}>
                      <span>订单编号</span>
                      <span>{palceldetail.orderId}</span>
                    </li>
                    <li className={styles.Dlist}>
                      <span>提交时间</span>
                      <span>{palceldetail.createTime}</span>
                    </li>
                  </div>
                </div>
              </div>
              <div className={styles.unpaybottom}/>
            </div>
            :
            <div className={styles.Dtotle}>
              <p className={styles.Dtitle} onClick={contact}>
                <span className={styles.Fimg}><img src={require("../../../../../images/order/Customer-service.png")}
                                                   alt=""/>联系客服</span>
                <span className={styles.Simg}>
                  <img src={require("../../../../../images/order/left_arrow.png")} alt=""/>
                </span>
              </p>
              <div className={styles.Dlast}>
                <li className={styles.Dlist}>
                  <span>订单编号</span>
                  <span>{palceldetail.orderId}</span>
                </li>
                <li className={styles.Dlist}>
                  <span>提交时间</span>
                  <span>{palceldetail.createTime}</span>
                </li>
                <li className={styles.Dlist}>
                  <span>支付时间</span>
                  <span>{this.setStatusPayTime(palceldetail.payDate, palceldetail.payTime)}</span>
                </li>
                <li className={styles.Dlist}>
                  <span>支付方式</span>
                  <span>{Constant.getPayWay(palceldetail.payWay)}</span>
                </li>
                <li className={styles.Dlist}>
                  <span>交易流水号</span>
                  <span>{palceldetail.orderJnId}</span>
                </li>
                {
                  palceldetail.orderStatus === "20" ?
                    null
                    :
                    <div>
                      <li className={styles.Dlist}>
                        <span>配货时间</span>
                        <span>{palceldetail.allocateTime}</span>
                      </li>
                      {
                        <li className={styles.Dlist}>
                          {
                            palceldetail.parcelList && _.findIndex(palceldetail.parcelList, item => !item.shippingTime === false) > -1 ?
                              <span className={styles.shippingTime}>发货时间</span>
                              : null
                          }
                          <span className={styles.delivery}>
                            {
                              palceldetail.parcelList && palceldetail.parcelList.map((goods, index) => {
                                return (
                                  goods.shippingTime ?
                                    <em key={index}>{goods.shippingTime}(包裹{index + 1})<br/></em> : null
                                )
                              })
                            }
                          </span>
                        </li>
                      }
                      {
                        <li className={styles.Dlist}>
                          {
                            palceldetail.parcelList && _.findIndex(palceldetail.parcelList, item => !item.expressNum === false) > -1 ?
                              <span className={styles.shippingTime}>快递单号</span>
                              : null
                          }
                          <span className={styles.delivery}>
                            {
                              palceldetail.parcelList && palceldetail.parcelList.map((goods, index) => {
                                return (
                                  goods.expressNum ?
                                    <em key={index}>{goods.expressNum}(包裹{index + 1})<br/></em> : null
                                )
                              })
                            }
                          </span>
                        </li>
                      }
                      {
                        <li className={styles.Dlist}>
                          {
                            palceldetail.parcelList && _.findIndex(palceldetail.parcelList, item => !item.receiveTime === false) > -1 ?
                              <span className={styles.shippingTime}>收货时间</span>
                              : null
                          }
                          <span className={styles.delivery}>
                            {
                              palceldetail.parcelList && palceldetail.parcelList.map((goods, index) => {
                                return (
                                  goods.receiveTime ?
                                    <em key={index}>{goods.receiveTime}(包裹{index + 1})<br/></em> : null
                                )
                              })
                            }
                          </span>
                        </li>
                      }
                    </div>
                }
              </div>
            </div>
        }
        {
          palceldetail.orderStatus === "10" ?
            <div className={styles.unpay}>
              <button className={styles.cancelOrder}
                      onClick={this.cancelOrderClick.bind(this, palceldetail.orderId)}>取消订单
              </button>
              <button className={styles.rightNow} onClick={this.nowPayClick.bind(this, palceldetail)}>
                立即支付
              </button>
            </div>
            :
            null
        }
      </div>
    );
  }
}

const contact = () => {
  Popup.show(
    <Contact />,
    {
      animationType: 'slide-up',
      maskClosable: true
    }
  )
}


const mapStateToProps = state => ({
  isFetching: state.orders.isFetching,
  palceldetail: state.orders.palceldetail,
  time: state.orders.time,
  deadtime: state.orders.deadtime,
  orderStatus: state.orders.orderStatus,
  visible: state.orders.visible,
  parcelstatus: state.orders.parcelstatus,
  nowTime: state.orders.nowTime,
})

const mapDispatchToProps = dispatch => ({
  orderActions: bindActionCreators(OrderActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrderDetails)
