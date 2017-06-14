/**
 * Created by HEro on 2017/5/24.
 */
import React, {Component} from 'react'
import styles from './index.scss'
import {Toast} from 'antd-mobile'
import {fetchApi, urlApi, RegExp} from 'service'
import {connect} from 'react-redux'
import {bindActionCreators} from 'redux'
import * as RefundsAction from 'actions/RefundsActions';
import {GoBack, Loading, FooterBox, SelectAddress} from 'components'


class JDPickup extends Component {

  constructor(props) {
    super(props);
    this.animationEnd = this.animationEnd.bind(this);
    this.state = {
      isShow: false,
      animationType: 'leave',
      detail: '',
      province: '',
      provinceName: '',
      city: '',
      cityName: '',
      country: '',
      countryName: '',
      village: '',
      villageName: '',
      address: '',
      telphone: '',
      mobile: '',
      contactor: '',
      visible: false,
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!this.props.visible && nextProps.visible) {
      this.enter();
    } else if (this.props.visible && !nextProps.visible) {
      this.leave();
    }
  }

  enter() {
    this.setState({
      isShow: true,
      animationType: 'enter'
    });
  }

  leave() {
    this.setState({
      animationType: 'leave'
    })
  }

  animationEnd() {
    if (this.state.animationType === 'leave') {
      this.setState({
        isShow: false,
      });
    }
  }

  selectAddress = () => {
    this.setState({visible: true})
  }

  setAddress = (result) => {
    let {selectedProvince, selectedCity, selectedCounty, selectedTown} = result;
    let province = '';
    let city = '';
    let country = '';
    let village = '';
    let provinceName = '';
    let cityName = '';
    let countryName = '';
    let villageName = '';
    if (selectedProvince) {
      province = selectedProvince.id;
      provinceName = selectedProvince.name;
    }
    if (selectedCity) {
      city = selectedCity.id;
      cityName = selectedCity.name;
    }
    if (selectedCounty) {
      country = selectedCounty.id;
      countryName = selectedCounty.name;
    }
    if (selectedTown) {
      village = selectedTown.id;
      villageName = selectedTown.name;
    }

    this.setState({
      detail: provinceName + ' ' + cityName + ' ' + countryName + ' ' + villageName,
      province,
      city,
      country,
      village,
      provinceName,
      cityName,
      countryName,
      villageName,
      visible: false
    })
  }

  handleInput = (type, e) => {
    // 判断 value 是否符合规则
    let value = e.target.value;
    if (type === 'mobile') {
      this.setState({[`${type}`]: RegExp.isLimitInput('account', value)});
    } else if (type === 'name') {
      this.setState({contactor: value});
    } else {
      this.setState({[`${type}`]: value});
    }
  }

  Apply = () => {
    const {search}=this.props;
    const {
      detail, contactor, mobile, address, province, city, country,
      village, provinceName, cityName, countryName, villageName,
    } = this.state;
    let mySearch = search;
    mySearch['pickupAddress'] = {
      contactor, mobile, telphone: mobile, address, province, provinceName,
      city, cityName, country, countryName, village, villageName
    }
    if (!contactor) {
      Toast.info('请输入联系人姓名');
    } else if (!mobile) {
      Toast.info('请输入联系人手机号码');
    } else if (mobile && !RegExp.isMobile(mobile)) {
      Toast.info('请输入正确的手机号码');
    } else if (!detail) {
      Toast.info('请选择取件地址');
    } else if (!address) {
      Toast.info('请输入取件详细地址');
    } else if ((address && !RegExp.isAccepted('text', address)) ||
      (contactor && !RegExp.isAccepted('text', contactor))) {
      Toast.info('不能输入敏感符号及表情');
    }else {
      this.props.refundActions.queryApplyRefund(mySearch);
    }
  }

  onClose = () => {
    this.setState({visible: false})
  }

  render() {
    const {isShow, animationType, visible, detail, contactor, address, mobile}=this.state;
    const style = {
      display: isShow ? '' : 'none',
      WebkitAnimationDuration: '300ms',
      animationDuration: '300ms'
    }
    return (
      <div className={`z-60 ${styles.selectbox} rodal-popleft-${animationType}`} style={style}
           onAnimationEnd={this.animationEnd}>
        <GoBack name="填写取件信息" bottom="true"/>
        <div className={styles.refund}>
          <div className={styles.refundtype}>
            <div className={`font-24  ${styles.refundprompt}`}>
              取件联系人<em className={`font-30 ${styles.required}`}>*</em>
            </div>
            <div className={styles.refundmoney}>
              <input type="text" value={contactor} onChange={this.handleInput.bind(this, 'name')}
                     maxLength="20" placeholder="请填写联系人姓名"/>
            </div>
          </div>
          <div className={styles.refundtype}>
            <div className={`font-24  ${styles.refundprompt}`}>
              手机号码<em className={`font-30 ${styles.required}`}>*</em>
            </div>
            <div className={styles.refundmoney}>
              <input type="text" value={mobile} name="mobile" maxLength="11"
                     onChange={this.handleInput.bind(this, 'mobile')}
                     placeholder="请填写联系人手机号码"/>
            </div>
          </div>
          <div className={styles.refundtype}>
            <div className={`font-24  ${styles.refundprompt}`}>
              取件地址<em className={`font-30 ${styles.required}`}>*</em>
            </div>
            <div className={styles.refundaddress} onClick={this.selectAddress}>
              {detail ? <div>
                  <div className={`ver-center ${styles.address}`}>
                    <span>{detail}</span>
                    <span className={`${styles.rightarr}`}>
                      <img src={require('../../../../images/mine/refund/rightarr.png')} alt=""/>
                    </span>
                  </div>
                </div> :
                <div>
                  <div className={`ver-center ${styles.noaddress}`}>
                    <span>请选择取件省、市、区、街道</span>
                    <span className={styles.rightarr}>
                      <img src={require('../../../../images/mine/refund/rightarr.png')} alt=""/>
                    </span>
                  </div>
                </div>}
            </div>
          </div>
          <div className={styles.refundtype}>
            <div className={`font-24  ${styles.refundprompt}`}>
              详细地址<em className={`font-30 ${styles.required}`}>*</em>
            </div>
            <div className={styles.refundmoney}>
              <input type="text" value={address} onChange={this.handleInput.bind(this, 'address')}
                     maxLength="150" placeholder="请填写取件详细地址"/>
            </div>
          </div>
        </div>
        <SelectAddress setAddress={this.setAddress} visible={visible} onClose={this.onClose}/>
        <FooterBox visible={!visible} name="提交申请" handleClick={this.Apply}/>
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
)(JDPickup)
