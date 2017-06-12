/**
 * Created by Administrator on 2017/5/16.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import fetch from 'isomorphic-fetch'
import {GoBack, SetHelmet, Loading, FooterBox, ConfirmModal, JDPickup} from 'components';
import styles from './index.scss';
import {Tool, urlApi, fetchApi, Constant, Image, RegExp} from 'service';
import * as RefundsAction from 'actions/RefundsActions';
import {Toast, Picker, List, AppRegistry} from 'antd-mobile';
const type = [{
  value: 'REFUND_ONLY',
  label: '仅退款',
}, {
  value: 'RETURN_AND_REFUND',
  label: '退货退款',
}];
const flag = [{
  value: 'RECEIVED',
  label: '已收到货物',
}, {
  value: 'PENDING_RECEIVE',
  label: '未收到货物',
}];
class ApplyRefund extends Component {
  constructor(props) {
    super(props);
    this.state = {
      uploading: false,
      orderId: '',
      requestId: '',
      payPrice: 0,
      quantity: 0,
      skuId: '',
      refundNumber: 1,
      refundType: '',
      receiveFlag: '',
      remark: '',
      refundAmount: '',
      selectedValue: '',
      pictureUrls: [],
      visible: false,
      mySearch: {}
    }
  }

  componentDidMount() {
    let query = this.props.params.data;
    let data = JSON.parse(query);
    if (data.storeId && data.storeId === 'JD') {
      this.setState({refundType: 'RETURN_AND_REFUND'});
    }
    if (!data.orderId) {
      this.props.refundActions.getRefundDetail(data);
    }
  }


  componentWillReceiveProps(nextProps) {
    const {detail} = nextProps;
    if (this.props.detail !== detail) {
      this.setState({
        orderId: detail.orderId,
        requestId: detail.requestId,
        skuId: detail.skuId,
        refundType: detail.requestRefundType ? detail.requestRefundType : '',
        receiveFlag: detail.receievedFlag ? detail.receievedFlag : '',
        refundAmount: detail.refundAmount || detail.refundAmount == 0 ? parseFloat(detail.refundAmount).toFixed(2) : '',
        refundNumber: detail.refundNumber ? detail.refundNumber : 1,
        payPrice: detail.unitPrice,
        remark: detail.remark ? detail.remark : '',
        quantity: detail.quantity ? detail.quantity : 1,
        pictureUrls: detail.pictures ? detail.pictures : []
      });
    }
  }

  reasonChange = (e) => {
    let remark = e.target.value;
    this.setState({remark});
  }

  moneyChange = (e) => {
    let refundAmount = e.target.value;
    if(refundAmount.indexOf('.')){
      if (refundAmount.split('.').length === 2 && refundAmount.split('.')[1].length > 2) {
        return;
      }
    }
    this.setState({refundAmount})
  }

  numChange = (e) => {
    let refundNumber = e.target.value;
    this.setState({refundNumber})
  }

  desQuantity = bol => {
    if (bol) {
      this.setState({
        refundNumber: this.state.refundNumber - 1
      })
    } else {
      return;
    }
  }

  addQuantity = bol => {
    if (bol) {
      this.setState({
        refundNumber: this.state.refundNumber + 1
      })
    } else {
      return;
    }
  }

  handleUpload = (e) => {
    const file = e.target.files[0];
    this.setState({uploading: true});
    Image.compressImg(file,
      arrayBuffer => {
        this.uploadImg('compress', arrayBuffer)
      }, () => {
        const data = new FormData();
        data.append('file', file);
        this.uploadImg('normal', data);
      })
  }

  uploadImg = (type, body) => {
    const {pictureUrls} = this.state;
    const headers = type === 'compress' ? {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data; boundary=NGFileboundary'
      } : {
        'X-Requested-With': 'XMLHttpRequest'
      }
    fetch(`${urlApi.image.testUpload}?value=CMS`, {
      method: 'POST',
      headers,
      body
    }).then(response => response.json())
      .then(json => {
        this.setState({uploading: false});
        if (json.success) {
          this.setState({
            pictureUrls: [...pictureUrls, ...json.url]
          })
        } else {
          Toast.info(json.msg)
        }
        if (this.refs.uploadFile) {
          this.refs.uploadFile.value = null
        }
      }).catch(e => {
      this.setState({uploading: false});
      Toast.info('网络请求失败，请检查您的网络');
      if (this.refs.uploadFile) {
        this.refs.uploadFile.value = null
      }
    })
  }

  delUploadFile = (delUrl, e) => {
    e.preventDefault();
    let {pictureUrls} = this.state;
    this.setState({
      pictureUrls: pictureUrls.filter(url => url !== delUrl)
    })
  }

  //提交申请
  Apply = () => {
    let query = this.props.params.data;
    let data = JSON.parse(query);
    let price = data.payPrice;
    let storeId = data.storeId;
    let {refundType, receiveFlag, remark, refundAmount, refundNumber, orderId, payPrice, skuId, requestId, pictureUrls} = this.state;
    let mySearch = {
      account: localStorage.account,
      requestId,
      orderId: orderId ? orderId : data.orderId,
      refundType,
      receiveFlag,
      remark,
      refundAmount,
      refundNumber,
      skuId: skuId ? skuId : data.skuId,
      urls: pictureUrls
    }
    let modify = {};
    if (mySearch) {
      for (let item in mySearch) {
        if (mySearch[item]) {
          modify[item] = mySearch[item];
        }
      }
      mySearch = modify;
    }
    if (!refundType) {
      Toast.info('请选择退款类型');
    } else if (refundType === 'RETURN_AND_REFUND' && !receiveFlag) {
      Toast.info('请选择收货状态');
    } else if (!remark) {
      Toast.info('请输入退款原因');
    } else if (!refundAmount) {
      Toast.info('请输入退款金额');
    } else if (refundAmount && parseFloat(refundAmount) > (price ? price : payPrice) * refundNumber) {
      Toast.info('退款金额不能大于购买商品时的金额');
    } else if (!RegExp.isMoney(refundAmount)) {
      Toast.info('请输入正确的金额格式');
    } else {
      if (storeId !== 'JD') {
        this.props.refundActions.queryApplyRefund(mySearch);
      } else {
        this.setState({visible: true, mySearch: mySearch});
      }
    }
  }

  setType = e => {
    const {receiveFlag} = this.state;
    let refundType = e[0];
    this.setState({refundType, receiveFlag: refundType === 'RETURN_AND_REFUND' ? receiveFlag : ''});
  }

  setFlag = e => {
    let receiveFlag = e[0];
    this.setState({receiveFlag});
  }

  render() {
    const {isFetching} = this.props;
    let query = this.props.params.data;
    let data = JSON.parse(query);
    let price = data.payPrice;
    let count = data.quantity;
    let storeId = data.storeId;
    const {
      refundType, remark, refundAmount, receiveFlag, refundNumber,
      payPrice, quantity, requestId, pictureUrls, visible, mySearch
    } = this.state;
    return (
      <div className={styles.applyrefund}>
        {
          (isFetching || this.state.uploading) && <Loading />
        }
        <SetHelmet title={requestId ? '修改退款申请' : '申请退款'}/>
        <GoBack name={requestId ? '修改退款申请' : '申请退款'} bottom="true"/>

        <div className={styles.refund}>
          <div className={styles.refundtype} onClick={this.refundtype}>
            <div className={`font-24  ${styles.refundprompt}`}>
              退款类型<em className={`font-30 ${styles.required}`}>*</em>
            </div>
            <Picker data={type} disabled={storeId === 'JD'} cols={1} extra="" onChange={(v) => this.setType(v)}>
              {
                refundType ? refundType === 'REFUND_ONLY' ?
                    <List.Item arrow="horizontal">
                      <div className={styles.pickerpad}>仅退款</div>
                    </List.Item> :
                    <List.Item arrow="horizontal">
                      <div className={styles.pickerpad}>退货退款</div>
                    </List.Item> :
                  <List.Item arrow="horizontal">
                    <div className={styles.pickernocolor}>请选择退款类型</div>
                  </List.Item>
              }
            </Picker>
          </div>
          {
            refundType === 'RETURN_AND_REFUND' ?
              <div className={styles.refundtype} onClick={this.refundtype}>
                <div className={`font-24  ${styles.refundprompt}`}>
                  收货状态<em className={`font-30 ${styles.required}`}>*</em>
                </div>
                <Picker data={flag} cols={1} extra="" onChange={(v) => this.setFlag(v)}>
                  {
                    receiveFlag ? receiveFlag === 'RECEIVED' ?
                        <List.Item arrow="horizontal">
                          <div className={styles.pickerpad}>已收到货物</div>
                        </List.Item> :
                        <List.Item arrow="horizontal">
                          <div className={styles.pickerpad}>未收到货物</div>
                        </List.Item> :
                      <List.Item>
                        <div className={styles.pickernocolor}>请选择收货状态</div>
                      </List.Item>
                  }
                </Picker>
              </div> : null
          }
          <div className={styles.refundtype}>
            <div className={`font-24  ${styles.refundprompt}`}>
              退款原因<em className={`font-30 ${styles.required}`}>*</em>
            </div>
            <div className={styles.refundmoney}>
              <input type="text" value={remark } onChange={this.reasonChange} placeholder="请选择退款原因"/>
            </div>
          </div>
          <div className={styles.refundtype}>
            <div className={`font-24  ${styles.refundprompt}`}>
              退款数量<em className={`font-30 ${styles.required}`}>*</em>
            </div>
            <div className={styles.refundchoose}>
              <p className={`font-28 color333 ${styles.inputshort}`}>
                请选择退款数量
              </p>
              <div className={styles.refundnum}>
                <div className={styles.clickadd}
                     onClick={this.desQuantity.bind(this, refundNumber === 1 ? false : true)}>-
                </div>
                <div className={styles.number}>
                  <div onChange={this.numChange}>{refundNumber}</div>
                </div>
                <div className={styles.clickreduce}
                     onClick={this.addQuantity.bind(this, refundNumber === parseInt(count ? count : quantity) ? false : true)}>
                  +
                </div>
              </div>
            </div>
          </div>
          <div className={styles.refundtype}>
            <div className={`font-24  ${styles.refundprompt}`}>
              退款金额<em
              className={`font-30 ${styles.required}`}>*</em>(最多可退￥<em>{price ?
              price && (price * refundNumber).toFixed(2) : payPrice && (payPrice * refundNumber).toFixed(2)}</em>)
            </div>
            <div className={styles.refundmoney}>
              <input type="text" value={refundAmount} onChange={this.moneyChange} placeholder="请选择退款金额"/>
            </div>
          </div>
          <div className={styles.refundtype}>
            <div className={`font-24 ${styles.refundprompt}`}>
              上传凭证（最多3张）
            </div>
            <div className={styles.picbox}>
              {
                pictureUrls.map((pic, index) =>
                  <div key={index} className={styles.pic}>
                    <div className={styles.del} onClick={this.delUploadFile.bind(this, pic)}/>
                    <img src={pic} alt=""/>
                  </div>
                )
              }
              {
                pictureUrls.length < 3 &&
                <div className={`${styles.pic} ${styles.addpic}`}>
                  <label htmlFor="refundFile" className={styles.filelabel}/>
                  <input ref="uploadFile"
                         className={styles.fileinput}
                         type="file"
                         accept="image/*"
                         id="refundFile"
                         onChange={this.handleUpload.bind(this)}/>
                </div>
              }
            </div>
          </div>

        </div>
        <JDPickup visible={visible} search={mySearch}/>
        <FooterBox visible={!visible} name={storeId === 'JD' ? '下一步，填写取件信息' : requestId ? '保存修改' : '提交申请'}
                   handleClick={this.Apply}/>
        <div className={styles.bottomB}></div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.refunds.isFetching,
  detail: state.refunds.detail
})

const mapDispatchToProps = dispatch => ({
  refundActions: bindActionCreators(RefundsAction, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ApplyRefund)
