/**
 * Created by yiwu on 2017/2/17.
 */
import React, {Component} from 'react';
import {Link, hashHistory} from 'react-router'
import history from 'service/history'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ReactPullLoad, {STATS} from 'react-pullload'
import _ from 'lodash'
import {Tabs, Toast} from 'antd-mobile';
import {GoBack, Loading, ConfirmModal, HeaderNode, FooterNode, SetHelmet} from 'components';
import styles from './index.scss';
import {OrderStatus, Tool, urlApi, fetchApi, Constant} from 'service';
import * as OrderActions from 'actions/OrderActions';

const TabPane = Tabs.TabPane;
// 声明状态
const DELETE = 'DELETE';
const CANCEL = 'CANCEL';
// 定义modal内容
const DeleteTips = {
  tips: '确认删除该订单？',
  subTips: '删除后您将无法查看该笔订单信息',
  confirmBtnText: '删除'
}
const CancelTips = {
  tips: '确认取消订单？',
  subTips: '是否放弃支付该笔订单',
  confirmBtnText: '放弃支付',
  cancelBtnText: '考虑一下'
}

class Order extends Component {

  constructor(props) {
    super(props);
    this.state = {
      listStatus: props.params,
      listPage: 1,
      modalStatus: null,
      orderId: null,
      allData: [],
      unpayData: [],
      unallocatedData: [],
      unsendData: [],
      untakeData: [],
      all: [],
      unpay: [],
      unallocated: [],
      unsend: [],
      untake: [],
      allPage: 1,
      unpayPage: 1,
      unallocatedPage: 1,
      unsendPage: 1,
      untakePage: 1,
      allHasMore: true,
      unpayHasMore: true,
      unallocatedHasMore: true,
      unsendHasMore: true,
      untakeHasMore: true,
      allAction: STATS.init,
      unpayAction: STATS.init,
      unallocatedAction: STATS.init,
      unsendAction: STATS.init,
      untakeAction: STATS.init,
    }
  }

  componentDidMount() {
    const {status} = this.props.params;
    const {indentStatus} = this.props;
    if (this.props.location.search) {
      this.getData(status);
      hashHistory.replace('/mine/order/' + status);
    } else {
      this.getData(indentStatus ? indentStatus : status);
    }
  }


  componentWillReceiveProps(nextProps) {
    const {all, unpay, unallocated, unsend, untake} = nextProps;
    if (!_.isEmpty(all) && this.props.all !== all) {
      this.setState({all, allData: all, allPage: this.state.listPage})
    }
    if (!_.isEmpty(unpay) && this.props.unpay !== unpay) {
      this.setState({unpay, unpayData: unpay, unpayPage: this.state.listPage})
    }
    if (!_.isEmpty(unallocated) && this.props.unallocated !== unallocated) {
      this.setState({unallocated, unallocatedData: unallocated, unallocatedPage: this.state.listPage})
    }
    if (!_.isEmpty(unsend) && this.props.unsend !== unsend) {
      this.setState({unsend, unsendData: unsend, unsendPage: this.state.listPage})
    }
    if (!_.isEmpty(untake) && this.props.untake !== untake) {
      this.setState({untake, untakeData: untake, untakePage: this.state.listPage})
    }
  }

  getData = status => {
    const {listStatus} = this.state;
    if (status !== listStatus) this.setState({listStatus: status, listPage: 1});
    this.props.orderActions.queryOrderList(status)
  }

  handlePull = (status, pageNo) => {
    const {listStatus, allData, unpayData, unallocatedData, unsendData, untakeData} = this.state;
    let searchParams = {
      mobilePhone: localStorage.account,
      pageNo: pageNo,
      pageSize: 10,
      orderStatus: listStatus !== OrderStatus.all ? listStatus : null
    };
    let url = urlApi.order.queryList + Tool.setSearchParams(searchParams);
    fetchApi.get({url})
      .then(json => {
        if (json.success) {
          switch (listStatus) {
            case OrderStatus.all:
              const allHasMore = json.total > allData.length;
              const all = status ? json.result : [...allData, ...json.result];
              this.setState({
                all,
                allHasMore,
                allData: all,
                allAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case OrderStatus.unpay:
              const unpayHasMore = json.total > unpayData.length;
              const unpay = status ? json.result : [...unpayData, ...json.result];
              this.setState({
                unpay,
                unpayHasMore,
                unpayData: unpay,
                unpayAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case OrderStatus.unallocated:
              const unallocatedHasMore = json.total > unallocatedData.length;
              const unallocated = status ? json.result : [...unallocatedData, ...json.result];
              this.setState({
                unallocated,
                unallocatedHasMore,
                unallocatedData: unallocated,
                unallocatedAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case OrderStatus.unsend:
              const unsendHasMore = json.total > unsendData.length;
              const unsend = status ? json.result : [...unsendData, ...json.result];
              this.setState({
                unsend,
                unsendHasMore,
                unsendData: unsend,
                unsendAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case OrderStatus.untake:
              const untakeHasMore = json.total > untakeData.length;
              const untake = status ? json.result : [...untakeData, ...json.result];
              this.setState({
                untake,
                untakeHasMore,
                untakeData: untake,
                untakeAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            default:
              break;
          }
        } else {
          Toast.info(json.msg);
          switch (listStatus) {
            case OrderStatus.all:
              this.setState({
                allHasMore: true,
                allAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case OrderStatus.unpay:
              this.setState({
                unpayHasMore: true,
                unpayAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case OrderStatus.unallocated:
              this.setState({
                unallocatedHasMore: true,
                unallocatedAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case OrderStatus.unsend:
              this.setState({
                unsendHasMore: true,
                unsendAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case OrderStatus.untake:
              this.setState({
                untakeHasMore: true,
                untakeAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            default:
              break;
          }
        }
      }).catch(e => {
      Toast.info("网络请求失败，请检查您的网络");
      switch (listStatus) {
        case OrderStatus.all:
          this.setState({
            allHasMore: true,
            allAction: status ? STATS.refreshed : STATS.reset
          });
          break;
        case OrderStatus.unpay:
          this.setState({
            unpayHasMore: true,
            unpayAction: status ? STATS.refreshed : STATS.reset
          });
          break;
        case OrderStatus.unallocated:
          this.setState({
            unallocatedHasMore: true,
            unallocatedAction: status ? STATS.refreshed : STATS.reset
          });
          break;
        case OrderStatus.unsend:
          this.setState({
            unsendHasMore: true,
            unsendAction: status ? STATS.refreshed : STATS.reset
          });
          break;
        case OrderStatus.untake:
          this.setState({
            untakeHasMore: true,
            untakeAction: status ? STATS.refreshed : STATS.reset
          });
          break;
        default:
          break;
      }
    });
    switch (listStatus) {
      case OrderStatus.all:
        this.setState({
          listPage: parseInt(pageNo) > 1 ? pageNo : 1,
          allPage: parseInt(pageNo) > 1 ? pageNo : 1,
          allAction: status ? STATS.refreshing : STATS.loading
        });
        break;
      case OrderStatus.unpay:
        this.setState({
          listPage: parseInt(pageNo) > 1 ? pageNo : 1,
          unpayPage: parseInt(pageNo) > 1 ? pageNo : 1,
          unpayAction: status ? STATS.refreshing : STATS.loading
        });
        break;
      case OrderStatus.unallocated:
        this.setState({
          listPage: parseInt(pageNo) > 1 ? pageNo : 1,
          unallocatedPage: parseInt(pageNo) > 1 ? pageNo : 1,
          unallocatedAction: status ? STATS.refreshing : STATS.loading
        });
        break;
      case OrderStatus.unsend:
        this.setState({
          listPage: parseInt(pageNo) > 1 ? pageNo : 1,
          unsendPage: parseInt(pageNo) > 1 ? pageNo : 1,
          unsendAction: status ? STATS.refreshing : STATS.loading
        });
        break;
      case OrderStatus.untake:
        this.setState({
          listPage: parseInt(pageNo) > 1 ? pageNo : 1,
          untakePage: parseInt(pageNo) > 1 ? pageNo : 1,
          untakeAction: status ? STATS.refreshing : STATS.loading
        });
        break;
      default:
        break;
    }
  }

  handleAction(action) {
    switch (this.state.listStatus) {
      case OrderStatus.all:
        if (action === this.state.allAction) return false;
        if (action === STATS.refreshing) {
          this.handRefreshing()
        } else if (action === STATS.loading) {
          this.handLoadMore()
        } else {
          this.setState({allAction: action})
        }
        break;
      case OrderStatus.unpay:
        if (action === this.state.unpayAction) return false;
        if (action === STATS.refreshing) {
          this.handRefreshing()
        } else if (action === STATS.loading) {
          this.handLoadMore()
        } else {
          this.setState({unpayAction: action})
        }
        break;
      case OrderStatus.unallocated:
        if (action === this.state.unallocatedAction) return false;
        if (action === STATS.refreshing) {
          this.handRefreshing()
        } else if (action === STATS.loading) {
          this.handLoadMore()
        } else {
          this.setState({unallocatedAction: action})
        }
        break;
      case OrderStatus.unsend:
        if (action === this.state.unsendAction) return false;
        if (action === STATS.refreshing) {
          this.handRefreshing()
        } else if (action === STATS.loading) {
          this.handLoadMore()
        } else {
          this.setState({unsendAction: action})
        }
        break;
      case OrderStatus.untake:
        if (action === this.state.untakeAction) return false;
        if (action === STATS.refreshing) {
          this.handRefreshing()
        } else if (action === STATS.loading) {
          this.handLoadMore()
        } else {
          this.setState({untakeAction: action})
        }
        break;
      default:
        break;
    }
  }

  handRefreshing() {
    this.handlePull(true, 1);
  }

  handLoadMore() {
    let pageNo;
    switch (this.state.listStatus) {
      case OrderStatus.all:
        pageNo = this.state.allPage + 1;
        this.state.allHasMore && this.handlePull(false, pageNo);
        break;
      case OrderStatus.unpay:
        pageNo = this.state.unpayPage + 1;
        this.state.unpayHasMore && this.handlePull(false, pageNo);
        break;
      case OrderStatus.unallocated:
        pageNo = this.state.unallocatedPage + 1;
        this.state.unallocatedHasMore && this.handlePull(false, pageNo);
        break;
      case OrderStatus.unsend:
        pageNo = this.state.unsendPage + 1;
        this.state.unsendHasMore && this.handlePull(false, pageNo);
        break;
      case OrderStatus.untake:
        pageNo = this.state.untakePage + 1;
        this.state.untakeHasMore && this.handlePull(false, pageNo);
        break;
      default:
        break;
    }
  }

  cancelOrderClick = orderId => {
    this.setState({
      modalStatus: CANCEL,
      orderId
    });
    this.props.orderActions.openConfirmModal();
  }

  deleteOrderClick = orderId => {
    this.setState({
      modalStatus: DELETE,
      orderId
    });
    this.props.orderActions.openConfirmModal();
  }

  onCancel = () => {
    this.props.orderActions.closeConfirmModal()
  }

  onConfirm = () => {
    const {listStatus, listPage, modalStatus, orderId} = this.state;
    if (modalStatus === DELETE) {
      this.props.orderActions.deleteOrder(listStatus, listPage, orderId);
    } else if (modalStatus === CANCEL) {
      this.props.orderActions.cancelOrder(listStatus, orderId, listPage);
    }
  }

  nowPayClick = orderInfo => {
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

  goBack = () => {
    hashHistory.goBack();
  }

  render() {
    const {params, indentStatus, isFetching, visible, allEmpty, unpayEmpty, unallocatedEmpty, unsendEmpty, untakeEmpty} = this.props;
    const {modalStatus, all, unpay, unallocated, unsend, untake, allAction, unpayAction, unallocatedAction, unsendAction, untakeAction, allHasMore, unpayHasMore, unallocatedHasMore, unsendHasMore, untakeHasMore} = this.state;
    const TIPS = modalStatus === CANCEL ? CancelTips : DeleteTips;

    return (
      <div>
        {
          isFetching && <Loading />
        }
        <SetHelmet title="我的订单"/>
        <GoBack name="我的订单" bottom="true" goBack={this.goBack}/>
        <Tabs
          defaultActiveKey={ this.props.location.search ? params.status : indentStatus ? indentStatus : params.status}
          swipeable={false}
          className="order-tabs"
          onChange={this.getData}>
          <TabPane tab="全部" key={OrderStatus.all}>
            {
              !allEmpty ?
                <ReactPullLoad downEnough={150}
                               action={allAction}
                               handleAction={this.handleAction.bind(this)}
                               hasMore={allHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={FooterNode}
                               style={{overflowY: 'initial'}}>
                  <ul className={styles.order} ref="root">
                    {
                      all && all.map(order => {
                          return (
                            <li className={styles.pacel} key={order.orderId}>
                              <div className={styles.head}>
                                <p>
                                  <span className='font-26'>{order.storeName}发货</span>
                                </p>
                                {
                                  order.orderStatus === '90' || order.orderStatus === '60' ?
                                    <p onClick={this.deleteOrderClick.bind(this, order.orderId)}>
                                      <span>
                                        <img src={require("../../../../images/order/delate.png")}
                                             className={styles.delateImg}/>
                                      </span>
                                      <span className={styles.delate}>删除</span>
                                    </p>
                                    :
                                    null
                                }
                              </div>
                              <div className={styles.goods}>
                                {
                                  order.parcelList.length > 0 && order.parcelList.map((parcel, index) => {
                                      return (
                                        parcel.orderDetailList.length > 0 ?
                                          <Link
                                            to={`/mine/order/order_detail/${order.orderId}`}
                                            className={styles.Detail} key={index}>
                                          <span className={styles.pic}>
                                            <img
                                              src={parcel.orderDetailList[0].picture}
                                              alt="" className={styles.picture}/>
                                          </span>
                                            <div className={styles.desc}>
                                              <div className={styles.Sname}>
                                                <p className={`font-28 text-overflow-one ${styles.name}`}>
                                                  {parcel.orderDetailList[0].activityType &&
                                                  <span className={`color-fe5`}>
                                                    {Constant.changeActivity(parcel.orderDetailList[0].activityType)}
                                                    </span>}
                                                  {parcel.orderDetailList[0].productName}
                                                </p>
                                                <p className={`font-24 color8282 ${styles.quantity}`}>
                                                  共{parcel.orderDetailList.length}种商品</p>
                                              </div>
                                              <div className={styles.payed}>
                                                <p className={`font-28 color8282 ${styles.parcel}`}>
                                                  包裹{index + 1}</p>
                                                <p className={`font-26 color-fe5 ${styles.status}`}>
                                                  {Constant.getOrderStatus(parcel.status)}
                                                </p>
                                              </div>
                                            </div>
                                          </Link> : null
                                      )
                                    }
                                  )
                                }
                              </div>
                              {
                                order.orderStatus === '10' ?
                                  <div className={styles.footer}>
                                    <p className={styles.truepay}>
                                      实付：<em className={styles.truepaycolor}>¥{order.payAmount}</em></p>
                                    <p className={styles.btnWrapper}>
                                      <button
                                        className={`${styles.FButn} ${styles.gbutton}`}
                                        onClick={this.cancelOrderClick.bind(this, order.orderId)}>取消订单
                                      </button>
                                      <button
                                        className={`${styles.SButn} ${styles.gbutton}`}
                                        onClick={this.nowPayClick.bind(this, order)}>
                                        立即支付
                                      </button>
                                    </p>
                                  </div>
                                  :
                                  null
                              }
                            </li>
                          )
                        }
                      )
                    }
                  </ul>
                </ReactPullLoad>
                :
                <div className={styles.emptyOrder}>
                  <img src={require('../../../../images/mine/orders/order_icon_noorder.png')} alt=""/>
                  <p className="font-24 color8282">暂无相关订单</p>
                </div>
            }
          </TabPane>
          <TabPane tab="待支付" key={OrderStatus.unpay}>
            {
              !unpayEmpty ?
                <ReactPullLoad downEnough={150}
                               action={unpayAction}
                               handleAction={this.handleAction.bind(this)}
                               hasMore={unpayHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={FooterNode}
                               style={{overflowY: 'initial'}}>
                  <ul className={styles.order}>
                    {
                      unpay && unpay.map(order => {
                          return (
                            <li className={styles.pacel} key={order.orderId}>
                              <p className={styles.head}>
                                <span className='font-26'>{order.storeName}发货</span>
                              </p>
                              <div className={styles.goods}>
                                {
                                  order.parcelList.length > 0 && order.parcelList.map((parcel, index) => {
                                      return (
                                        parcel.orderDetailList.length > 0 ?
                                          <Link
                                            to={`/mine/order/order_detail/${order.orderId}`}
                                            className={styles.Detail} key={index}>
                                        <span className={styles.pic}>
                                          <img
                                            src={parcel.orderDetailList[0].picture}
                                            alt=""/>
                                        </span>
                                            <div className={styles.desc}>
                                              <div className={styles.Sname}>
                                                <p className={`font-28 text-overflow-one ${styles.name}`}>
                                                  <span className={`color-fe5`}>
                                                    {Constant.changeActivity(parcel.orderDetailList[0].activityType)}
                                                    </span>
                                                  {parcel.orderDetailList[0].productName}
                                                </p>
                                                <p className={`font-24 color8282 ${styles.quantity}`}>
                                                  共{parcel.orderDetailList.length}种商品</p>
                                              </div>
                                              <div className={styles.payed}>
                                                <p className={`font-28 color8282 ${styles.parcel}`}>
                                                  包裹{index + 1}</p>
                                                <p className={`font-26 color-fe5 ${styles.status}`}>
                                                  {Constant.getOrderStatus(parcel.status)}
                                                </p>
                                              </div>
                                            </div>
                                          </Link> : null
                                      )
                                    }
                                  )
                                }
                              </div>
                              <div className={styles.footer}>
                                <p className={styles.truepay}>实付：<em
                                  className={styles.truepaycolor}>¥{order.payAmount}</em></p>
                                <p className={styles.btnWrapper}>
                                  <button
                                    className={`${styles.FButn} ${styles.gbutton}`}
                                    onClick={this.cancelOrderClick.bind(this, order.orderId)}>取消订单
                                  </button>
                                  <button
                                    className={`${styles.SButn} ${styles.gbutton}`}
                                    onClick={this.nowPayClick.bind(this, order)}>
                                    立即支付
                                  </button>
                                </p>
                              </div>
                            </li>
                          )
                        }
                      )
                    }
                  </ul>
                </ReactPullLoad>
                :
                <div className={styles.emptyOrder}>
                  <img src={require('../../../../images/mine/orders/order_icon_noorder.png')} alt=""/>
                  <p className="font-24 color8282">暂无相关订单</p>
                </div>
            }
          </TabPane>
          <TabPane tab="待配货" key={OrderStatus.unallocated}>
            {
              !unallocatedEmpty ?
                <ReactPullLoad downEnough={150}
                               action={unallocatedAction}
                               handleAction={this.handleAction.bind(this)}
                               hasMore={unallocatedHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={FooterNode}
                               style={{overflowY: 'initial'}}>
                  <ul className={styles.order}>
                    {
                      unallocated && unallocated.map(order => {
                          return (
                            <li className={styles.pacel} key={order.orderId}>
                              <p className={styles.head}>
                                <span className='font-26'>{order.storeName}发货</span>
                              </p>
                              <div className={styles.goods}>
                                {
                                  order.parcelList.length > 0 && order.parcelList.map((parcel, index) => {
                                      return (
                                        parcel.orderDetailList.length > 0 ?
                                          <Link
                                            to={`/mine/order/order_detail/${order.orderId}`}
                                            className={styles.Detail} key={index}>
                                        <span className={styles.pic}>
                                          <img
                                            src={parcel.orderDetailList[0].picture}
                                            alt=""/>
                                        </span>
                                            <div className={styles.desc}>
                                              <div className={styles.Sname}>
                                                <p className={`font-28 text-overflow-one ${styles.name}`}>
                                                  <span className={`color-fe5`}>
                                                    {Constant.changeActivity(parcel.orderDetailList[0].activityType)}
                                                    </span>
                                                  {parcel.orderDetailList[0].productName}
                                                </p>
                                                <p className={`font-24 color8282 ${styles.quantity}`}>
                                                  共{parcel.orderDetailList.length}种商品</p>
                                              </div>
                                              <div className={styles.payed}>
                                                <p className={`font-28 color8282 ${styles.parcel}`}>
                                                  包裹{index + 1}</p>
                                                <p className={`font-26 color-fe5 ${styles.status}`}>
                                                  {Constant.getOrderStatus(parcel.status)}</p>
                                              </div>
                                            </div>
                                          </Link> : null
                                      )
                                    }
                                  )
                                }
                              </div>
                            </li>
                          )
                        }
                      )
                    }
                  </ul>
                </ReactPullLoad>
                :
                <div className={styles.emptyOrder}>
                  <img src={require('../../../../images/mine/orders/order_icon_noorder.png')} alt=""/>
                  <p className="font-24 color8282">暂无相关订单</p>
                </div>
            }
          </TabPane>
          <TabPane tab="待发货" key={OrderStatus.unsend}>
            {
              !unsendEmpty ?
                <ReactPullLoad downEnough={150}
                               action={unsendAction}
                               handleAction={this.handleAction.bind(this)}
                               hasMore={unsendHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={FooterNode}
                               style={{overflowY: 'initial'}}>
                  <ul className={styles.order}>
                    {
                      unsend && unsend.map(order => {
                          return (
                            <li className={styles.pacel} key={order.orderId}>
                              <p className={styles.head}>
                                <span className='font-26'>{order.storeName}发货</span>
                              </p>
                              <div className={styles.goods}>
                                {
                                  order.parcelList.length > 0 && order.parcelList.map((parcel, index) => {
                                      return (
                                        parcel.orderDetailList.length > 0 ?
                                          <Link
                                            to={`/mine/order/order_detail/${order.orderId}`}
                                            className={styles.Detail} key={index}>
                                        <span className={styles.pic}>
                                          <img src={parcel.orderDetailList[0].picture}
                                               alt=""/>
                                        </span>
                                            <div className={styles.desc}>
                                              <div className={styles.Sname}>
                                                <p className={`font-28 text-overflow-one ${styles.name}`}>
                                                  <span className={`color-fe5`}>
                                                    {Constant.changeActivity(parcel.orderDetailList[0].activityType)}
                                                    </span>
                                                  {parcel.orderDetailList[0].productName}
                                                </p>
                                                <p className={`font-24 color8282 ${styles.quantity}`}>
                                                  共{parcel.orderDetailList.length}种商品</p>
                                              </div>
                                              <div className={styles.payed}>
                                                <p className={`font-28 color8282 ${styles.parcel}`}>
                                                  包裹{index + 1}</p>
                                                <p className={`font-26 color-fe5 ${styles.status}`}>
                                                  {Constant.getOrderStatus(parcel.status)}</p>
                                              </div>
                                            </div>
                                          </Link> : null
                                      )
                                    }
                                  )
                                }
                              </div>
                            </li>
                          )
                        }
                      )
                    }
                  </ul>
                </ReactPullLoad>
                :
                <div className={styles.emptyOrder}>
                  <img src={require('../../../../images/mine/orders/order_icon_noorder.png')} alt=""/>
                  <p className="font-24 color8282">暂无相关订单</p>
                </div>
            }
          </TabPane>
          <TabPane tab="待收货" key={OrderStatus.untake}>
            {
              !untakeEmpty ?
                <ReactPullLoad downEnough={150}
                               action={untakeAction}
                               handleAction={this.handleAction.bind(this)}
                               hasMore={untakeHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={FooterNode}
                               style={{overflowY: 'initial'}}>
                  <ul className={styles.order}>
                    {
                      untake && untake.map(order => {
                          return (
                            <li className={styles.pacel} key={order.orderId}>
                              <p className={styles.head}>
                                <span className='font-26'>{order.storeName}发货</span>
                              </p>
                              <div className={styles.goods}>
                                {
                                  order.parcelList.length > 0 && order.parcelList.map((parcel, index) => {
                                      return (
                                        parcel.orderDetailList.length > 0 ?
                                          <Link
                                            to={`/mine/order/order_detail/${order.orderId}`}
                                            className={styles.Detail} key={index}>
                                        <span className={styles.pic}>
                                          <img src={parcel.orderDetailList[0].picture} alt=""/>
                                        </span>
                                            <div className={styles.desc}>
                                              <div className={styles.Sname}>
                                                <p className={`font-28 text-overflow-one ${styles.name}`}>
                                                  <span className={`color-fe5`}>
                                                    {Constant.changeActivity(parcel.orderDetailList[0].activityType)}
                                                    </span>
                                                  {parcel.orderDetailList[0].productName}
                                                </p>
                                                <p className={`font-24 color8282 ${styles.quantity}`}>
                                                  共{parcel.orderDetailList.length}种商品</p>
                                              </div>
                                              <div className={styles.payed}>
                                                <p className={`font-28 color8282 ${styles.parcel}`}>
                                                  包裹{index + 1}</p>
                                                <p className={`font-26 color-fe5 ${styles.status}`}>
                                                  {Constant.getOrderStatus(parcel.status)}</p>
                                              </div>
                                            </div>
                                          </Link> : null
                                      )
                                    }
                                  )
                                }
                              </div>
                            </li>
                          )
                        }
                      )
                    }
                  </ul>
                </ReactPullLoad>
                :
                <div className={styles.emptyOrder}>
                  <img src={require('../../../../images/mine/orders/order_icon_noorder.png')} alt=""/>
                  <p className="font-24 color8282">暂无相关订单</p>
                </div>
            }
          </TabPane>
        </Tabs>
        <ConfirmModal
          visible={visible}
          tips={TIPS.tips}
          subTips={TIPS.subTips}
          confirmBtnText={TIPS.confirmBtnText}
          cancelBtnText={TIPS.cancelBtnText}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm.bind(this)}/>
      </div >
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.orders.isFetching,
  indentStatus: state.orders.indentStatus,
  visible: state.orders.visible,
  all: state.orders.all,
  unpay: state.orders.unpay,
  unallocated: state.orders.unallocated,
  unsend: state.orders.unsend,
  untake: state.orders.untake,
  allEmpty: state.orders.allEmpty,
  unpayEmpty: state.orders.unpayEmpty,
  unallocatedEmpty: state.orders.unallocatedEmpty,
  unsendEmpty: state.orders.unsendEmpty,
  untakeEmpty: state.orders.untakeEmpty
})

const mapDispatchToProps = dispatch => ({
  orderActions: bindActionCreators(OrderActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Order)
