/**
 * Created by HEro on 2017/5/20.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import {GoBack, SetHelmet, Loading, FooterBox, ConfirmModal} from 'components';
import styles from './index.scss';
import {Tool, urlApi, fetchApi, Constant, RegExp} from 'service';

import * as RefundsAction from 'actions/RefundsActions';
import {Toast, Picker, List, AppRegistry} from 'antd-mobile';

const corp = Constant.EXPRESS_CORP;

class RefundInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expressCorp: '',
      expressNum: ''
    }
  }

  setCorp = e => {
    let expressCorp = e[0];
    this.setState({expressCorp});
  }

  setNum = e => {
    let expressNum = e.target.value;
    this.setState({expressNum: RegExp.isLimitInput('identity', expressNum)});
  }

  Submit = () => {
    let requestId = this.props.params.requestId;
    const {expressCorp, expressNum} = this.state;
    let mySearch = {
      requestId: requestId,
      committer: localStorage.account,
      decision: 'USER_RETURNED',
      nodeKey: 'WaitingAccountUserTask',
      exp: expressCorp,
      expFormId: expressNum
    }
    if (!expressCorp) {
      Toast.info('请选择快递公司');
    } else if (!expressNum) {
      Toast.info('请输入快递单号');
    } else {
      this.props.refundActions.queryRefundInfo(mySearch);
    }
  }

  render() {
    const {isFetching} = this.props;
    const {expressCorp, expressNum}=this.state;
    return (
      <div className={styles.refundinfo}>
        {
          isFetching && <Loading />
        }
        <SetHelmet title="填写退货信息"/>
        <GoBack name="填写退货信息" bottom="true"/>
        <div className={styles.refund}>
          <div className={styles.refundtype} onClick={this.refundtype}>
            <div className={`font-24  ${styles.refundprompt}`}>
              快递公司<em className={`font-30 ${styles.required}`}>*</em>
            </div>
            <Picker data={corp} cols={1} extra="" onChange={(v) => this.setCorp(v)}>
              {
                <List.Item arrow="horizontal">
                  {expressCorp ?
                    <div className={styles.pickerpad}>
                      {Constant.changeExpressCorp(expressCorp)}
                    </div> :
                    <div className={styles.pickernocolor}>请选择</div>}</List.Item>
              }
            </Picker>
          </div>
        </div>
        <div className={styles.refund}>
          <div className={styles.refundtype} onClick={this.refundtype}>
            <div className={`font-24  ${styles.refundprompt}`}>
              快递单号<em className={`font-30 ${styles.required}`}>*</em>
            </div>
            <div className={styles.refundmoney}>
              <input type="text" value={expressNum} maxLength="20" onChange={this.setNum} placeholder="请填写快递单号"/>
            </div>
          </div>
        </div>
        <FooterBox name="确认退货" handleClick={this.Submit}/>
      </div>
    )
  }

}

const mapStateToProps = state => ({
  isFetching: state.refunds.isFetching,
})

const mapDispatchToProps = dispatch => ({
  refundActions: bindActionCreators(RefundsAction, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RefundInfo)