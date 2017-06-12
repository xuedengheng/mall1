/**
 * Created by Ben on 2017/4/20.
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import styles from './index.scss'
import {GoBack, Loading, SetHelmet} from 'components'
import {Constant} from 'service'
import * as RefundsActions from 'actions/RefundsActions'

class RefundTrace extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    this.props.refundsActions.getRefundTrace(this.props.params.requestId)
  }

  render() {
    const {isFetching, trace} = this.props;
    return (
      <div className={styles.root}>
        <SetHelmet title="退款追踪"/>
        {isFetching && <Loading />}
        <GoBack name="退款追踪" bottom="true"/>
        <div className={styles.container}>
          {
            trace.map((item, index) => {
              let operator = Constant.getOperator(item.operator);
              return (
                <div className={styles.listWrapper} key={index}>
                  <div className={styles.headWrapper}>
                    <p className={styles.operator}>
                                            <span className={styles.icon}>
                                              {
                                                item.operator === 'SYSTEM' ?
                                                  <img className="img-responsive"
                                                       src={require('../../../../../../images/mine/refund/refund_yi.png')}
                                                       alt=""/> :
                                                  <img className="img-responsive"
                                                       src={require('../../../../../../images/mine/refund/refund_you.png')}
                                                       alt=""/>
                                              }
                                            </span>
                      <span className="font-28">{operator.name}</span>
                    </p>
                    <p className="font-24 color8282">
                      {item.createDate}
                    </p>
                  </div>
                  <div className={styles.contentWrapper}
                       dangerouslySetInnerHTML={{__html: item.message}}/>
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.refunds.isFetching,
  trace: state.refunds.trace
})

const mapDispatchToProps = dispatch => ({
  refundsActions: bindActionCreators(RefundsActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RefundTrace)