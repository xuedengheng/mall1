import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {hashHistory} from 'react-router'
import {connect} from 'react-redux'
import {GoBack, Loading, ConfirmModal, HeaderNode, FooterNode, SetHelmet, CouponItem} from 'components'
import {Tabs, Toast} from 'antd-mobile'
import _ from 'lodash'
import ReactPullLoad, {STATS} from 'react-pullload'
import {dateUtil, urlApi, fetchApi, Tool, CouponType} from 'service'
import * as CouponAction from 'actions/CouponActions'
import styles from './index.scss'

const TabPane = Tabs.TabPane;

const DeleteTips = {
  tips: '确认删除该优惠券',
  confirmBtnText: '确定',
  cancelBtnText: '取消'
}

class Coupon extends Component {

  state = {
    listStatus: CouponType.adopted,
    couponId: null,
    visible: false,
    adoptedData: [],
    usedData: [],
    expiredData: [],
    adopted: [],
    used: [],
    expired: [],
    adoptedPage: 0,
    usedPage: 0,
    expiredPage: 0,
    adoptedHasMore: true,
    usedHasMore: true,
    expiredHasMore: true,
    adoptedAction: STATS.init,
    usedAction: STATS.init,
    expiredAction: STATS.init,
    hasRefresh: false,
    wrapperEvent: '',
  }


  componentDidMount() {
    this.getData(CouponType.adopted);
  }

  componentWillReceiveProps(nextProps) {
    const {adopted, used, expired} = nextProps;
    if (!_.isEmpty(adopted) && this.props.adopted !== adopted) {
      this.setState({adopted, adoptedData: adopted});
    }
    if (!_.isEmpty(used) && this.props.used !== used) {
      this.setState({used, usedData: used});
    }
    if (!_.isEmpty(expired) && this.props.expired !== expired) {
      this.setState({expired, expiredData: expired});
    }
  }

  componentWillUnmount() {
    this.props.couponActions.initCoupon();
  }


  getData = status => {
    this.setState({listStatus: status});
    if (status === CouponType.adopted && this.state.adopted.length !== 0) {
      return;
    } else if (status === CouponType.used && this.state.used.length !== 0) {
      return;
    } else if (status === CouponType.expired && this.state.expired.length !== 0) {
      return;
    }
    this.props.couponActions.getCouponList(status);
  }

  handlePull = (status, page) => {
    const {listStatus, adoptedData, usedData, expiredData} =this.state;
    let searchParams = {
      account: localStorage.account,
      status: listStatus,
      page: page,
      size: 10
    }
    let url = urlApi.coupon.query + Tool.setSearchParams(searchParams);
    fetchApi.get({url})
      .then(json => {
        if (json.success) {
          switch (listStatus) {
            case CouponType.adopted:
              const adoptedHasMore = json.total > adoptedData.length;
              const adopted = status ? json.coupons : [...adoptedData, ...json.coupons];
              this.setState({
                adopted,
                adoptedHasMore,
                adoptedData: adopted,
                adoptedAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case CouponType.used:
              const usedHasMore = json.total > usedData.length;
              const used = status ? json.coupons : [...usedData, ...json.coupons];
              this.setState({
                used,
                usedHasMore,
                usedData: used,
                usedAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case CouponType.expired:
              const expiredHasMore = json.total > expiredData.length;
              const expired = status ? json.coupons : [...expiredData, ...json.coupons];
              this.setState({
                expired,
                expiredHasMore,
                expiredData: expired,
                expiredAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            default:
              break;
          }
        } else {
          Toast.info(json.msg);
          switch (listStatus) {
            case CouponType.adopted:
              this.setState({
                adoptedHasMore: true,
                adoptedAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case CouponType.used:
              this.setState({
                usedHasMore: true,
                usedAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            case CouponType.expired:
              this.setState({
                expiredHasMore: true,
                expiredAction: status ? STATS.refreshed : STATS.reset
              });
              break;
            default:
              break;
          }
        }
      }).catch(e => {
      Toast.info(e.message);
      switch (listStatus) {
        case CouponType.adopted:
          this.setState({
            adoptedHasMore: true,
            adoptedAction: status ? STATS.refreshed : STATS.reset
          });
          break;
        case CouponType.used:
          this.setState({
            usedHasMore: true,
            usedAction: status ? STATS.refreshed : STATS.reset
          });
          break;
        case CouponType.expired:
          this.setState({
            expiredHasMore: true,
            expiredAction: status ? STATS.refreshed : STATS.reset
          });
          break;
        default:
          break;
      }
    });
    switch (listStatus) {
      case CouponType.adopted:
        this.setState({
          adoptedPage: parseInt(page) > 0 ? page : 0,
          adoptedAction: status ? STATS.refreshing : STATS.loading
        });
        break;
      case CouponType.used:
        this.setState({
          usedPage: parseInt(page) > 0 ? page : 0,
          usedAction: status ? STATS.refreshing : STATS.loading
        });
        break;
      case CouponType.expired:
        this.setState({
          expiredPage: parseInt(page) > 0 ? page : 0,
          expiredAction: status ? STATS.refreshing : STATS.loading
        });
        break;
      default:
        break;
    }
  }

  handleAction(action) {
    switch (this.state.listStatus) {
      case CouponType.adopted:
        if (action === this.state.adoptedAction) return false;
        if (action === STATS.refreshing) {
          this.handRefreshing();
        } else if (action === STATS.loading) {
          this.handLoadMore();
        } else {
          this.setState({adoptedAction: action})
        }
        break;
      case CouponType.used:
        if (action === this.state.usedAction)return false;
        if (action === STATS.refreshing) {
          this.handRefreshing();
        } else if (action === STATS.loading) {
          this.handLoadMore();
        } else {
          this.setState({usedAction: action});
        }
        if (action === STATS.reset) {
        }
        break;
      case CouponType.expired:
        if (action === this.state.expiredAction)return false;
        if (action === STATS.refreshing) {
          this.handRefreshing();
        } else if (action === STATS.loading) {
          this.handLoadMore();
        } else {
          this.setState({expiredAction: action});
        }
        break;
      default:
        break;
    }
    this.setState({hasRefresh: false, couponId: ''});
  }

  handRefreshing() {
    this.handlePull(true, 0);
    this.setState({hasRefresh: true,});
  }

  handLoadMore() {
    let page;
    switch (this.state.listStatus) {
      case CouponType.adopted:
        page = this.state.adoptedPage + 1;
        this.state.adoptedHasMore && this.handlePull(false, page);
        break;
      case CouponType.used:
        page = this.state.usedPage + 1;
        this.state.usedHasMore && this.handlePull(false, page);
        break;
      case CouponType.expired:
        page = this.state.expiredPage + 1;
        this.state.expiredHasMore && this.handlePull(false, page);
      default:
        break;
    }
    this.setState({hasRefresh: true,});
  }

  deleteCoupon = (couponId) => {
    this.setState({visible: true, couponId, hasRefresh: false});
  }

  cancelDelete = () => {
    this.setState({visible: false});
  }

  wrapperClick = (id) => {
    this.setState({couponId: id, hasRefresh: false});
  }

  confirmDelete = () => {
    this.setState({visible: false, couponId: ''});
    const {listStatus, couponId} = this.state;
    this.props.couponActions.deleteCoupon(listStatus, couponId);
  }

  renderEmptyFooter = () => {
    return (
      <div></div>
    )
  }

  toRule = () => {
    hashHistory.push(`/lnk?url=${encodeURIComponent('http://cdn.9yiwu.com/H5/Rule/coupon_rule.html')}&title=优惠券规则`);
  }

  render() {
    const {isFetching, adoptedEmpty, usedEmpty, expiredEmpty} = this.props;
    const {
      hasRefresh, couponId, visible, adopted, used, expired, adoptedAction,
      usedAction, expiredAction, adoptedHasMore, usedHasMore, expiredHasMore
    } = this.state;
    const TIPS = DeleteTips;
    return (
      <div>
        <SetHelmet title="我的优惠券"/>
        {isFetching && <Loading />}
        <div className={styles.title}>
          <div className={`fixed-top ver-center ${styles.content} border-bottom`}>
            <div className={`center-center ${styles.back}`} onClick={ () => {
              hashHistory.goBack()
            }}>
              <img src={require('../../../../images/base/search_icon_back.png')} alt=""/>
            </div>
            <p className="text-center font-32 text-overflow-1">
              我的优惠券
            </p>
            <div onClick={this.toRule.bind(this)} className={`center-center ${styles.question}`}>
              <img src={require('../../../../images/mine/coupon/youhuiquan_wenhao.png')} alt=""/>
            </div>
          </div>

        </div>

        <Tabs defaultActiveKey="ADOPTED" swipeable={false} destroyInactiveTabPane={true}
              className="card-tabs" onChange={this.getData}>
          <TabPane tab="未使用" key="ADOPTED">
            {
              !adoptedEmpty ?
                <ReactPullLoad downEnough={150}
                               action={adoptedAction}
                               handleAction={this.handleAction.bind(this)}
                               hasMore={adoptedHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={this.renderEmptyFooter}
                               style={{overflowY: 'initial'}}>
                  <div className={styles.couponwrapper}>
                    {
                      adopted && adopted.map((coupon, index) => {
                        return (
                          <CouponItem hasRefresh={hasRefresh}
                                      key={index} coupon={coupon} mode="edit"/>
                        )
                      })
                    }
                  </div>
                </ReactPullLoad> :
                <div className={styles.emptycoupon}>
                  <img src={require('../../../../images/mine/coupon/coupons_wuyouhuiquan.png')} alt=""/>
                  <p className="font-24 color8282">还没有优惠券</p>
                </div>
            }
          </TabPane>
          < TabPane tab="已使用" key="USED">
            {
              !usedEmpty ?
                <ReactPullLoad downEnough={150}
                               action={usedAction}
                               handleAction={this.handleAction.bind(this)}
                               hasMore={usedHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={this.renderEmptyFooter}
                               style={{overflowY: 'initial'}}>
                  <div className={styles.couponwrapper}>
                    {
                      used && used.map((coupon, index) => {
                        return (
                          <CouponItem key={index} coupon={coupon} mode="edit" hasRefresh={hasRefresh}
                                      onDel={this.deleteCoupon.bind(this, coupon.id)}
                                      couponClick={this.wrapperClick.bind(this, coupon.id)}
                                      couponId={couponId}/>
                        )
                      })
                    }
                  </div>
                </ReactPullLoad> :
                <div className={styles.emptycoupon}>
                  <img src={require('../../../../images/mine/coupon/coupons_wuyouhuiquan.png')} alt=""/>
                  <p className="font-24 color8282">还没有优惠券</p>
                </div>
            }
          </TabPane>
          <TabPane tab="已过期" key="EXPIRED">
            {
              !expiredEmpty ?
                <ReactPullLoad downEnough={150}
                               action={expiredAction}
                               handleAction={this.handleAction.bind(this)}
                               hasMore={expiredHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={this.renderEmptyFooter}
                               style={{overflowY: 'initial'}}>
                  <div className={styles.couponwrapper}>
                    {
                      expired && expired.map((coupon, index) => {
                        return (
                          <CouponItem couponClick={this.wrapperClick.bind(this, coupon.id)} couponId={couponId}
                                      key={index} coupon={coupon} mode="edit" hasRefresh={hasRefresh}
                                      onDel={this.deleteCoupon.bind(this, coupon.id)}/>
                        )
                      })
                    }
                  </div>
                </ReactPullLoad> :
                <div className={styles.emptycoupon}>
                  <img src={require('../../../../images/mine/coupon/coupons_wuyouhuiquan.png')} alt=""/>
                  <p className="font-24 color8282">还没有优惠券</p>
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
          onCancel={this.cancelDelete.bind(this)}
          onConfirm={this.confirmDelete.bind(this)}/>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  isFetching: state.coupon.isFetching,
  visible: state.coupon.visible,
  adopted: state.coupon.adopted,
  adoptedEmpty: state.coupon.adoptedEmpty,
  used: state.coupon.used,
  usedEmpty: state.coupon.usedEmpty,
  expired: state.coupon.expired,
  expiredEmpty: state.coupon.expiredEmpty,
})

const mapDispatchToProps = dispatch => ({
  couponActions: bindActionCreators(CouponAction, dispatch)
})

export default connect(mapStateToProps,
  mapDispatchToProps)(Coupon)