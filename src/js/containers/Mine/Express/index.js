/**
 * Created by yiwu on 2017/5/3.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {GoBack, Loading, ConfirmModal, HeaderNode, FooterNode} from 'components';
import styles from './index.scss';
import {OrderStatus, Tool, urlApi, fetchApi, Constant} from 'service';
import * as OrderActions from 'actions/OrderActions';
import {constant} from 'service'


class Express extends Component {

  componentDidMount() {
    const {expressNum} = this.props.params;
    this.props.orderActions.queryExpress(expressNum);
  }

  componentWillUnmount() {
    this.props.orderActions.clearExpress();
  }


  render() {
    const {isFetching, orderTrack} = this.props;

    return (
      <div className={styles.Express}>
        {
        isFetching && <Loading />
        }
        <GoBack name="查看物流" bottom="true"/>

        <div className={styles.iframeStyle}>
          <div>
            <div className={styles.JDExpress}>
              <div className={styles.JDtitle}>
                <img src={require("../../../../images/mine/orders/JDlogo.png")} alt="" className={styles.JDlogo}/>
              </div>
              {
                orderTrack && orderTrack.length > 0 ?
                  <div className={`font-28 ${styles.WaybillNumber}`}>
                    <p className={styles.expressName}>京东快递</p>
                    <p>运单编号：<em>{this.props.params.expressNum}</em></p>
                  </div>
                  :
                  <div className={`font-28 ${styles.WaybillNumber}`}>
                    <p className={styles.expressnone}>京东快递</p>
                    <p>运单编号：<em>{this.props.params.expressNum}</em></p>
                    <p>物流状态：暂时无物流信息</p>
                  </div>
              }
            </div>
            <div className={styles.expressList}>
              <p className={`font-28 ${styles.Tracking}`}>物流跟踪</p>
              <div className={styles.Position}>
                <ul className={styles.PositionList}>
                  {
                    orderTrack.map((logisticsdetail, index) => {
                      return (
                        <li className={styles.FirstStop} key={index}>
                          <div className={styles.circle}><em className={styles.orange}></em></div>
                          <div className={styles.positionPrompt}>
                            <p className={styles.firstWorld}>{logisticsdetail.content}</p>
                            <p>{logisticsdetail.msgTime}</p>
                          </div>
                        </li>
                      )
                    })
                  }
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.orders.isFetching,
  jdOrderId: state.orders.jdOrderId,
  orderTrack: state.orders.orderTrack
})

const mapDispatchToProps = dispatch => ({
  orderActions: bindActionCreators(OrderActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Express)
