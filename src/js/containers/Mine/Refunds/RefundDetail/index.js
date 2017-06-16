/**
 * Created by Ben on 2017/4/19.
 */
import React, {Component} from 'react'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {Link, hashHistory} from 'react-router'
import {GoBack, Loading, SetHelmet, ConfirmModal} from 'components'
import {Constant} from 'service'
import styles from './index.scss'
import * as RefundsActions from 'actions/RefundsActions'

//京东是否取件弹出框
const ConfirmTips = {
  tips: ' 确认已取件？',
  subTips: '请确认京东人员已收取您的退款货物',
  cancelBtnText: '取消',
  confirmBtnText: '确定'
}

class RefundDetail extends Component {
  state = {
    visible: false
  }

  componentDidMount() {
    let data = JSON.parse(this.props.params.data);
    this.props.refundsActions.getRefundDetail(data)
  }

  toEditRefund = () => {
    const {detail} = this.props;
    if (detail.status === 'PENDING_RETURN' && detail.platform !== 'JD') {
      hashHistory.push(`/mine/applyrefund/${detail.requestId}/refundinfo`);
    } else if (detail.status === 'PENDING_RETURN' && detail.platform === 'JD') {
      this.setState({visible: true});
    } else if (detail.status === 'IN_PROGRESSING') {
      hashHistory.push(`/mine/applyrefund/${detail.requestId}`);
    } else if (detail.status === 'USER_RETURNED') {
      window.location.href = `http://m.kuaidi100.com/index_all.html?type=${Constant.getExpressType(detail.snapshot.express)}&postid=${detail.snapshot.expressFormId}&callbackurl=${encodeURIComponent(window.location.href)}`;
    }
  }
  onCancel = () => {
    this.setState({visible: false});
  }

  onConfirm = () => {
    const {detail}=this.props;
    this.setState({visible: false});
    let mySearch = {
      requestId: detail.requestId,
      committer: localStorage.account,
    }
    this.props.refundsActions.queryJdReturn(mySearch);
  }


  render() {
    const {isFetching, detail} = this.props;
    const {visible}=this.state;
    const status = Constant.getRefundsMessage(detail.status, detail.platform === 'JD');
    const TIPS = ConfirmTips;
    return (
      <div className={styles.root}>
        <SetHelmet title="退款详细"/>
        {isFetching && <Loading />}
        <GoBack name="退款详细" bottom="true"/>
        <div className={styles.container}>
          <div className={styles.headWrapper}>
            <div className={styles.statusWrapper}>
                            <span className={styles.icon}>
                                {
                                  detail.status === 'IN_PROGRESSING' &&
                                  <img className="img-responsive"
                                       src={require('../../../../../images/mine/refund/-refund_icon_review.png')}
                                       alt=""/>
                                }
                              {
                                (detail.status === 'USER_RETURNED' || detail.status === 'PENDING_RETURN') &&
                                <img className="img-responsive"
                                     src={require('../../../../../images/mine/refund/-refund_icon_-return-goods.png')}
                                     alt=""/>
                              }
                              {
                                detail.status === 'PENDING_REFUND' &&
                                <img className="img-responsive"
                                     src={require('../../../../../images/mine/refund/-refund_icon_-refund.png')}
                                     alt=""/>
                              }
                              {
                                detail.status === 'REFUNDED' &&
                                <img className="img-responsive"
                                     src={require('../../../../../images/mine/refund/-refund_icon_-refund-success.png')}
                                     alt=""/>
                              }
                              {
                                detail.status === 'REJECT' &&
                                <img className="img-responsive"
                                     src={require('../../../../../images/mine/refund/refund-_icon_refund-failed.png')}
                                     alt=""/>
                              }
                            </span>
              <span className="font-30">{detail.shortcut && detail.shortcut.title}</span>
            </div>
            <p className={styles.content}
               dangerouslySetInnerHTML={{__html: detail.shortcut ? detail.shortcut.content : ''}}/>
            {
              status.btnText ?
                <button onClick={this.toEditRefund} className={styles.change}>{status.btnText}</button> : null
            }
          </div>
          <div className={styles.contentWrapper}>
            <Link to={`/mine/refund/${detail.requestId}/refundtrace`} className={styles.catch}>
              <span className="font-28">退款追踪</span>
              <i className="arrow-right"/>
            </Link>
            <ul className={styles.detail}>
              <li className={styles.listWrapper}>
                <p className={styles.left}>退款类型</p>
                <p className={styles.right}>{Constant.getRefundType(detail.requestRefundType)}</p>
              </li>
              {
                detail.requestRefundType === 'RETURN_AND_REFUND' &&
                <li className={styles.listWrapper}>
                  <p className={styles.left}>退款状态</p>
                  <p className={styles.right}>{Constant.getRefundFlag(detail.receievedFlag)}</p>
                </li>
              }

              <li className={styles.listWrapper}>
                <p className={styles.left}>退款数量</p>
                <p className={styles.right}>{detail.refundNumber}</p>
              </li>
              <li className={styles.listWrapper}>
                <p className={styles.left}>退款金额</p>
                <p
                  className={styles.right}>{(detail.refundAmount || detail.refundAmount == 0 ) && parseFloat(detail.refundAmount).toFixed(2)}元</p>
              </li>
              {
                detail.remark &&
                <li className={styles.listWrapper}>
                  <p className={styles.left}>退款理由</p>
                  <p className={styles.right}>{detail.remark}</p>
                </li>
              }
              <li className={styles.listWrapper}>
                <p className={styles.left}>退款编号</p>
                <p className={styles.right}>{detail.requestId}</p>
              </li>
              <li className={styles.listWrapper}>
                <p className={styles.left}>申请时间</p>
                <p className={styles.right}>{detail.createDate}</p>
              </li>
              {
                detail.pickupAddress &&
                <li className={styles.listWrapper}>
                  <p className={styles.left}>取件人</p>
                  <p className={styles.right}>{detail.pickupAddress.contactor}</p>
                </li>
              }
              {
                detail.pickupAddress &&
                <li className={styles.listWrapper}>
                  <p className={styles.left}>手机号码</p>
                  <p className={styles.right}>{detail.pickupAddress.mobile}</p>
                </li>
              }
              {
                detail.pickupAddress &&
                <li className={styles.listWrapper}>
                  <p className={styles.left}>取件地址</p>
                  <p
                    className={styles.right}>
                    {detail.pickupAddress.provinceName + ' ' + detail.pickupAddress.cityName + ' '
                    + detail.pickupAddress.countryName + ' ' + detail.pickupAddress.villageName + ' '
                    + detail.pickupAddress.address}</p>
                </li>
              }
            </ul>
          </div>
        </div>
        <ConfirmModal
          visible={visible}
          tips={TIPS.tips}
          subTips={TIPS.subTips}
          confirmBtnText={TIPS.confirmBtnText}
          cancelBtnText={TIPS.cancelBtnText}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm.bind(this)}/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.refunds.isFetching,
  detail: state.refunds.detail
})

const mapDispatchToProps = dispatch => ({
  refundsActions: bindActionCreators(RefundsActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RefundDetail)