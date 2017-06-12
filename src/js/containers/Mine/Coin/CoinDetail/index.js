/**
 * Created by Ben on 2016/12/11.
 */
import React, {Component} from 'react'
import {GoBack, Loading, SetHelmet} from 'components'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import styles from './index.scss'
import {Constant} from 'service'
import * as WalletActions from 'actions/WalletActions'

class CoinDetail extends Component {

  componentDidMount() {
    const {sequenceId, type} = this.props.params;
    this.props.walletActions.queryJournalDetail({sequenceId, type})
  }

  render() {

    const {journaldetail, isFetching} = this.props;

    return (
      <div className='box'>
        <SetHelmet title="收支详情"/>
        {isFetching && <Loading />}
        <GoBack name="收支详情"/>
        <div className={styles.Alltotle}>
          <div className={styles.totle}>
            <p className={styles.pay}>{Constant.getCoinType(journaldetail.type)}</p>
            <p className={`${styles.num} ${journaldetail.type === 'Outcome' ? styles.outcome : ''}`}>
              <span>{journaldetail.type === 'Outcome' ? '-' : '+'}</span>
              <span>{journaldetail.amount && journaldetail.amount.toFixed(2)}</span>
            </p>
            {journaldetail.type === 'Outcome' && <p className={styles.sucess}>支付成功</p>}
            {journaldetail.type === 'Drawback' && <p className={styles.sucess}>退款成功</p>}
            {journaldetail.type === 'Income' && <p className={styles.sucess}>充值成功</p>}
          </div>
          {
            journaldetail.type === 'Outcome' &&
            <div>
              <div className={styles.states}>
                <p className={styles.order}>
                  <span>支付备注</span>
                  <span>{journaldetail.remark}</span>
                </p>
                <p className={styles.order}>
                  <span>交易单号</span>
                  <span>{journaldetail.paymentChargeId}</span>
                </p>
                <p className={styles.order}>
                  <span>流水单号</span>
                  <span>{journaldetail.sequenceId}</span>
                </p>
                <p className={styles.order}>
                  <span>支付时间</span>
                  <span>{journaldetail.operateTime}</span>
                </p>
                <p className={styles.order}>
                  <span>支付方式</span>
                  <span>{journaldetail.payMode === 'YIWUCOIN' && "易点支付"}</span>
                </p>
              </div>
            </div>
          }
          {
            journaldetail.type === 'Income' &&
            <div className={styles.states}>
              <p className={styles.order}>
                <span>充值方式</span>
                <span>{journaldetail.payMode === 'YIWUCOIN' && "易物卡"}</span>
              </p>
              <p className={styles.order}>
                <span>充值时间</span>
                <span>{journaldetail.operateTime}</span>
              </p>
              <p className={styles.order}>
                <span>充值卡号</span>
                <span>{journaldetail.cardId && journaldetail.cardId.replace(/^(\w{4})\w{9}(.*)$/, '$1******$2')}</span>
              </p>
              <p className={styles.order}>
                <span>流水单号</span>
                <span>{journaldetail.sequenceId}</span>
              </p>
            </div>
          }
          {
            journaldetail.type === 'Drawback' &&
            <div className={styles.states}>
              <p className={styles.order}>
                <span>退款备注</span>
                <span>{journaldetail.remark}</span>
              </p>
              <p className={styles.order}>
                <span>退款单号</span>
                <span>{journaldetail.paymentChargeId}</span>
              </p>
              <p className={styles.order}>
                <span>流水单号</span>
                <span>{journaldetail.sequenceId}</span>
              </p>
              <p className={styles.order}>
                <span>退款时间</span>
                <span>{journaldetail.operateTime}</span>
              </p>
            </div>
          }
        </div>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  isFetching: state.wallet.isFetching,
  journaldetail: state.wallet.journaldetail
})

const mapDispatchToProps = dispatch => ({
  walletActions: bindActionCreators(WalletActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CoinDetail)
