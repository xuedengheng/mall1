/**
 * Created by yiwu on 2017/2/21.
 */
import React, {Component} from 'react';
import {Link} from 'react-router'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import ReactPullLoad, {STATS} from 'react-pullload'
import {Toast} from 'antd-mobile'
import {GoBack, Loading, HeaderNode, FooterNode, SetHelmet} from 'components'
import styles from './index.scss'
import {Constant, urlApi, fetchApi} from 'service'
import * as RefundsActions from 'actions/RefundsActions'

const ACCOUNT = localStorage.account;
const PAGESIZE = 20;

class Refunds extends Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 0,
      data: [],
      hasMore: true,
      action: STATS.init
    }
  }

  componentDidMount() {
    this.props.refundsActions.getRefunds()
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.list.length > 0) {
      this.setState({data: nextProps.list})
    }
  }

  getData = (status, pageNo) => {
    fetchApi.get({url: `${urlApi.postpurchase.list}/${ACCOUNT}/${pageNo}/${PAGESIZE}`})
      .then(json => {
        if (json.success) {
          const hasMore = json.total > this.state.data.length
          const data = status ? json.details : [...this.state.data, ...json.details];
          this.setState({
            hasMore,
            data,
            action: status ? STATS.refreshed : STATS.reset
          })
        } else {
          Toast.info(json.msg);
          this.setState({
            hasMore: true,
            action: status ? STATS.refreshed : STATS.reset
          })
        }
      }).catch(e => {
      Toast.info("网络请求失败，请检查您的网络");
      this.setState({hasMore: true, action: status ? STATS.refreshed : STATS.reset})
    })
    this.setState({
      page: parseInt(pageNo) > 0 ? pageNo : 0,
      action: status ? STATS.refreshing : STATS.loading
    })
  }

  handleAction(action) {
    if (action === this.state.action) return false;
    if (action === STATS.refreshing) {
      this.handRefreshing()
    } else if (action === STATS.loading) {
      this.handLoadMore()
    } else {
      this.setState({action})
    }
  }

  handRefreshing() {
    this.getData(true, 0);
  }

  handLoadMore() {
    if (this.state.hasMore) {
      this.getData(false, this.state.page + 1)
    }
  }

  render() {
    const {isFetching} = this.props;
    return (
      <div className={styles.root}>
        <SetHelmet title="退货/售后"/>
        {isFetching && <Loading />}
        <GoBack name="退货/售后" bottom="true"/>
        <div className={styles.container}>
          {this.renderList()}
        </div>
      </div>
    )
  }

  renderList = () => {
    const {data, action, hasMore} = this.state;
    if (!this.props.empty) {
      return (
        <ReactPullLoad downEnough={150}
                       action={action}
                       handleAction={this.handleAction.bind(this)}
                       hasMore={hasMore}
                       distanceBottom={100}
                       HeadNode={HeaderNode}
                       FooterNode={FooterNode}
                       style={{overflowY: 'initial'}}>
          {
            data.map((item, index) =>
              <Link to={`/mine/refund/${item.requestId}`} className={styles.listWrapper} key={index}>
                <div className={styles.head}>
                  <p className="font-26">{item.merchantName}发货</p>
                  <p className={styles.status}>
                                        <span className="font-24 color-fe5">
                                            {Constant.getDetailStatus(item.status)}</span>
                    <i className="arrow-right"/>
                  </p>
                </div>
                <div className={styles.content}>
                  <div className={styles.thumb}>
                    <img className="img-responsive" src={item.skuPicture} alt=""/>
                  </div>
                  <div className={styles.detail}>
                    <div className={styles.desc}>
                      <p className={`text-overflow-2 font-26 ${styles.name}`}>
                        {item.activityType &&
                        <span className={`color-fe5`}>
                          {Constant.changeActivity(item.activityType)}
                        </span>}
                        {item.productName}
                      </p>
                      <p className="font-20 color8282">
                        规格：{item.skuName}
                      </p>
                    </div>
                    {/*<div className={styles.count}>*/}
                    {/*<p className={`font-30 ${styles.price}`}>¥{item.unitPrice}</p>*/}
                    {/*<p className="font-20 color8282">×{item.quantity}</p>*/}
                    {/*</div>*/}
                  </div>
                </div>
                <div className={styles.footer}>

                  <span className="font-20">交易金额：¥{item.amount && parseFloat(item.amount).toFixed(2)} </span>
                  <span className="font-20">退款金额：</span>
                  <span className="font-28 color-fe5"><i
                    className="font-20">¥ </i>{item.refundAmount && parseFloat(item.refundAmount).toFixed(2)}</span>
                </div>
              </Link>
            )
          }
        </ReactPullLoad>
      )
    }
    return (
      <div className="empty-box">
        <div className="pic">
          <img src={require('../../../../images/mine/refund/order_icon_noorder.png')} alt=""/>
        </div>
        <p className="text">暂无退款信息</p>
      </div>
    )
  }
}

const mapStateToProp = state => ({
  isFetching: state.refunds.isFetching,
  list: state.refunds.list,
  empty: state.refunds.empty
})

const mapDispatchToProps = dispatch => ({
  refundsActions: bindActionCreators(RefundsActions, dispatch)
})

export default connect(
  mapStateToProp,
  mapDispatchToProps
)(Refunds)