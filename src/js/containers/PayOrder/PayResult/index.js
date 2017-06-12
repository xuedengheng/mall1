/**
 * Created by Ben on 2016/12/11.
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import URI from 'urijs'
import * as PayActions from 'actions/PayActions'
import {urlApi, Constant, getQueryString, dateUtil} from 'service'
import {Link, hashHistory} from 'react-router'
import {
  GoBack,
  Loading,
  SetHelmet
} from 'components'

import styles from './index.scss';

class PayResult extends Component {
  componentWillMount() {
    const isWeixin = '?wx=weixin';
    const {href, search} = window.location;
    let newURI = href;
    if (search === isWeixin) {
      newURI = newURI.split(isWeixin).join('')
    }
    const {_parts} = new URI(newURI.split('#/').join(''));
    let orderJnId;
    if (getQueryString(_parts.query, 'outOrderNo')) {
      orderJnId = getQueryString(_parts.query, 'outOrderNo')
    } else if (getQueryString(this.props.location.search, 'orderJnId')) {
      orderJnId = getQueryString(this.props.location.search, 'orderJnId');
    }
    this.props.payActions.queryPayResult({orderJnId});
  }

  goLnk = url => {
    hashHistory.replace(url)
  }

  render() {
    const {isFetching, result} = this.props;
    return (
      <div>
        <SetHelmet title="支付结果"/>
        {
          isFetching && <Loading />
        }
        <div className={styles.title}>
          <div className={`fixed-top ver-center ${styles.content}`}>
            <p className="text-center font-32 text-overflow-1">
              支付结果
            </p>
          </div>
        </div>
        <div className={styles.PaySuccess}>
          {
            result.payStatus ?
              result.payStatus === '60' ?
                <div className={styles.top}>
                  <div className={styles.Pimg}><img
                    src={require("../../../../images/order/SuccessPay/pay_icon_success.png")} alt=""/></div>
                  <div className={styles.Success}>支付成功</div>
                  <div className={styles.Scongrate}>恭喜你，该订单已成功支付</div>
                </div> :
                <div className={styles.top}>
                  <div className={styles.Pimg}><img
                    src={require("../../../../images/order/SuccessPay/pay_result_icon_fail.png")} alt=""/></div>
                  <div className={styles.Success}>支付失败</div>
                </div>
              : null
          }

          <div className={styles.Sdetails}>
            <p className={styles.list}>
              <span className={styles.listLeft}>支付金额</span>
              <span className={styles.listRed}>¥{result.payAmount}</span>
            </p>
            <p className={styles.list}>
              <span className={styles.listLeft}>交易单号</span>
              <span className={styles.listRight}>{result.orderId}</span>
            </p>
            {
              result.payStatus === '60' ?
                <p className={styles.list}>
                  <span className={styles.listLeft}>交易时间</span>
                  <span className={styles.listRight}>{dateUtil.changePayTime(result.payDateTime)}</span>
                </p> : null
            }
            <p className={styles.list}>
              <span className={styles.listLeft}>支付方式 </span>
              <span className={styles.listRight}>{Constant.getPayWay(result.payWay)}</span>
            </p>
            {
              result.payStatus === '60' ?
                <p className={styles.list}>
                  <span className={styles.listLeft}>流水单号</span>
                  <span className={styles.listRight}>{result.payNo}</span>
                </p> : null
            }
          </div>
          <div className={styles.btn}>
            <div onClick={this.goLnk.bind(this, "/home")} className={styles.back}>返回首页</div>
            <div onClick={this.goLnk.bind(this, `/mine/order/1000?from=pay`)} className={styles.check}>查看订单</div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isFetching: state.pay.isFetching,
  result: state.pay.result,
})

const mapDispatchToProps = dispatch => ({
  payActions: bindActionCreators(PayActions, dispatch)
})


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PayResult)
