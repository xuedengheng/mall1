/**
 * Created by Ben on 2017/3/2.
 */
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {
  GoBack,
  Loading,
  FooterBox,
  SelectAddress,
  SetHelmet,
  ConfirmModal
} from 'components'
import {Switch, Toast} from 'antd-mobile'
import styles from './index.scss'
import {urlApi, fetchApi, RegExp} from 'service'
import * as AddressActions from 'actions/AddressActions'

const ADD = 0;
const EDIT = 1;

const DeleteTips = {
  tips: '是否删除地址？',
  confirmBtnText: '确定',
  cancelBtnText: '取消'
}

class EditDetail extends Component {

  state = {
    type: '',
    title: '',
    name: '',
    mobile: '',
    identityId: '',
    areaCode: '',
    postCode: '',
    province: '',
    city: '',
    block: '',
    town: '',
    street: '',
    address: '',
    addressId: '',
    visible: false,
    deleteVisable: false,
    checked: false,
  }

  componentDidMount() {
    const {params, addressActions} = this.props;
    if (params.id) {
      let mySearch = {
        url: urlApi.address.queryDetail,
        search: {
          userId: localStorage.userId,
          addressId: params.id,
        }
      }
      addressActions.queryAddressDetail(mySearch);
      this.setState({
        addressId: params.id,
        type: EDIT,
        title: '编辑收货地址'
      });
      return;
    }
    this.setState({
      type: ADD,
      title: '新增收货地址'
    })
  }

  componentWillReceiveProps(nextProps) {
    const {detail} = nextProps;
    if (this.props.detail !== detail && detail && detail.addresses && detail.addresses.length > 0) {
      const {name, mobile, identityId, areaCode, postCode, province, city, block, town, street, address, defaultFlag} = detail.addresses[0];
      let checked = false;
      if (defaultFlag === 'Y') {
        checked = true;
      }
      this.setState({
        name,
        mobile,
        identityId,
        areaCode,
        postCode: postCode ? postCode : '',
        province,
        city,
        block,
        town,
        street,
        address,
        checked
      })
    }
  }

  checkoutValid = () => {
    const {name, mobile, areaCode, postCode, street, address} = this.state
    if (!name) {
      Toast.info('请输入收货人姓名');
      return false
    } else if (!mobile) {
      Toast.info('请输入收货人手机号码');
      return false
    } else if (mobile && !RegExp.isMobile(mobile)) {
      Toast.info('请输入正确的手机号码');
      return false
    } else if (postCode && !RegExp.isPostcode(postCode)) {
      Toast.info('请输入正确的邮政编码');
      return false
    } else if ((street && !RegExp.isAccepted('text', street)) ||
      (address && !RegExp.isAccepted('text', address)) ||
      (name && !RegExp.isAccepted('text', name))) {
      Toast.info('不能输入敏感符号及表情');
      return false
    } else if (!areaCode) {
      Toast.info('请选择省市区');
      return false
    } else if (!street) {
      Toast.info('请输入街道');
      return false
    } else if (!address) {
      Toast.info('请输入详细地址');
      return false
    }
    return true
  }

  save = () => {
    if (this.checkoutValid()) {
      let {
        type, address, addressId, areaCode, block, city, checked, identityId, mobile, name, postCode, province,
        street,
        town
      } = this.state;
      let account = localStorage.account;
      let defaultFlag = checked ? 'Y' : 'N';
      let url, params;
      switch (type) {
        case EDIT:
          url = urlApi.address.update;
          break;
        case ADD:
          url = urlApi.address.create;
          break;
        default:
          break;
      }
      params = {
        url,
        search: {
          account,
          address,
          addressId,
          areaCode,
          block,
          city,
          defaultFlag,
          identityId,
          mobile,
          name,
          postCode: postCode ? postCode : null,
          province,
          street,
          town
        }
      };
      this.props.addressActions.editAddress(params);
    }
  }

  deleteAddress = () => {
    this.setState({deleteVisable: true});
  }

  onCancel = () => {
    this.setState({deleteVisable: false});
  }

  onConfirm = (bol) => {
    this.setState({deleteVisable: false});
    if (bol) {
      Toast.info('默认地址不能被删除！')
    } else {
      let params = {
        url: urlApi.address.delete,
        search: {account: localStorage.account, addressId: this.state.addressId}
      }
      this.props.addressActions.editAddress(params);
    }
  }

  handleInput = (type, e) => {
    // 判断 value 是否符合规则
    let value = e.target.value;
    if (type === 'account') {
      this.setState({mobile: RegExp.isLimitInput(type, value)});
    } else if (type === 'postCode') {
      this.setState({[`${type}`]: RegExp.isLimitInput('account', value)});
    } else if (type === 'identity') {
      this.setState({identityId: RegExp.isLimitInput(type, value)});
    } else {
      this.setState({[`${type}`]: value});
    }
  }

  handleChange = bol => {
    if (!bol) {
      this.setState({
        checked: !this.state.checked
      })
    } else {
      Toast.info('必须有一个默认地址');
    }
  }

  selectAddress = () => {
    this.setState({visible: true})
  }

  setAddress = (result) => {
    let {selectedProvince, selectedCity, selectedCounty, selectedTown} = result;
    let areaCode = '';
    let province = '';
    let city = '';
    let block = '';
    let town = '';
    if (selectedProvince) {
      areaCode += selectedProvince.id;
      province = selectedProvince.name;
    }
    if (selectedCity) {
      areaCode += '_' + selectedCity.id;
      city = selectedCity.name;
    } else {
      areaCode += '_0';
      city = ''
    }
    if (selectedCounty) {
      areaCode += '_' + selectedCounty.id;
      block = selectedCounty.name;
    } else {
      areaCode += '_0';
      block = ''
    }
    if (selectedTown) {
      areaCode += '_' + selectedTown.id;
      town = selectedTown.name;
    } else {
      areaCode += '_0';
      town = ''
    }
    this.setState({
      areaCode,
      province,
      city,
      block,
      town,
      visible: false
    })
  }

  onClose = () => {
    this.setState({visible: false})
  }

  render() {
    const {isFetching, detail} = this.props;
    const {type, title, name, mobile, identityId, postCode, province, city, block, town, street, address, visible, checked, deleteVisable} = this.state;
    const TIPS = DeleteTips;
    return (
      <div>
        <SetHelmet title={title}/>
        {isFetching && <Loading />}
        <GoBack name={title} clickName={type === EDIT ? '保存' : null}
                handleClick={type === EDIT ? this.save : null} bottom="true"/>
        <div className={styles.listWrapper}>
          <div className={styles.label}>收货人</div>
          <div className={styles.writePanel}>
            <input type="text" name="name" maxLength="10" value={name} placeholder="请输入收货人姓名"
                   onChange={this.handleInput.bind(this, 'name')}/>
          </div>
        </div>
        <div className={styles.listWrapper}>
          <div className={styles.label}>手机号码</div>
          <div className={styles.writePanel}>
            <input type="text" name="mobile" maxLength="11" value={mobile} placeholder="请输入收货人手机号"
                   onChange={this.handleInput.bind(this, 'account')}/>
          </div>
        </div>
        <div className={styles.listWrapper}>
          <div className={styles.label}>身份证</div>
          <div className={styles.writePanel}>
            <input type="text" name="identity" maxLength="18" value={identityId} placeholder="请输入收货人身份证号"
                   onChange={this.handleInput.bind(this, 'identity')}/>
          </div>
        </div>
        <div className={styles.listWrapper}>
          <div className={styles.label}>邮政编码</div>
          <div className={styles.writePanel}>
            <input type="text" name="postcode" maxLength="6" value={postCode} placeholder="请输入邮政编码"
                   onChange={this.handleInput.bind(this, 'postCode')}/>
          </div>
        </div>
        <div className={styles.listWrapper} onClick={this.selectAddress}>
          <div className={styles.label}>省市区</div>
          <div className={styles.writePanel}>
            <span>{province}</span>
            <span>{city}</span>
            {block !== '' && <span>{block}</span>}
            {town !== '' && <span>{town}</span>}
          </div>
          <div className={styles.icon}>
            <i className="arrow-right"/>
          </div>
        </div>
        <div className={styles.listWrapper}>
          <div className={styles.label}>街道</div>
          <div className={styles.writePanel}>
            <input type="text" maxLength="20" name="street" value={street} placeholder="请输入街道"
                   onChange={this.handleInput.bind(this, 'street')}/>
          </div>
        </div>
        <div className={styles.listWrapper}>
          <div className={styles.label}>详细地址</div>
          <div className={styles.writePanel}>
            <input type="text" maxLength="150" name="address" value={address} placeholder="请输入详细地址"
                   onChange={this.handleInput.bind(this, 'address')}/>
          </div>
        </div>
        {
          type === 0 ?
            <div>
              <div className={styles.sign}>
                <p style={{textAlign: 'left'}}>
                  易物的海外商品应海关要求需提供身份证信息，易物会保护您的信息安全
                </p>
              </div>
              <FooterBox name="立即保存" handleClick={this.save}/>
            </div>
            :
            <div>
              <div className={styles.controlList}>
                <div className={styles.default}>设为默认</div>
                <div className={styles.controlWrapper}
                     onClick={this.handleChange.bind(this, detail.addresses && detail.addresses[0].defaultFlag === 'Y')}>
                  <Switch checked={checked}/>
                </div>
              </div>
              <div className={styles.deleteWrapper}
                   onClick={this.deleteAddress.bind(this)}>
                删除地址
              </div>
            </div>
        }
        <SelectAddress setAddress={this.setAddress} visible={visible} onClose={this.onClose}/>
        <ConfirmModal
          visible={deleteVisable}
          tips={TIPS.tips}
          subTips={TIPS.subTips}
          confirmBtnText={TIPS.confirmBtnText}
          cancelBtnText={TIPS.cancelBtnText}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm.bind(this, detail.addresses && detail.addresses[0].defaultFlag === 'Y')}/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.address.isFetching,
  detail: state.address.detail,
})

const mapDispatchToProps = dispatch => ({
  addressActions: bindActionCreators(AddressActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditDetail)