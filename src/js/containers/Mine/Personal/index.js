/**
 * Created by yiwu on 2017/2/16.
 */
import React, {Component} from 'react';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Picker, List, Toast} from 'antd-mobile'
import * as PersonalAction from 'actions/PersonalActions'
import {Link, hashHistory} from 'react-router';
import styles from './index.scss';
import {Image, urlApi} from 'service';
import {GoBack, Loading, SetHelmet, SelectAddress, ConfirmModal} from 'components';


const SignOutTips = {
  tips: '是否退出当前用户？',
  cancelBtnText: '否',
  confirmBtnText: '是'
}

const sexSelect = [{
  value: 'MALE',
  label: '男',
}, {
  value: 'FEMALE',
  label: '女',
}];

class Personal extends Component {
  state = {
    value: null,
    sex: null,
    areaCode: '',
    province: '',
    city: '',
    picture: '',
    block: '',
    visible: false,
    signOutVisible: false,
    uploading: false,
    userInfo: {}
  }

  componentDidMount() {
    if (localStorage.userInfo) {
      let userInfo = JSON.parse(localStorage.userInfo);
      let sex = userInfo.sex === 'MALE' ? '男' : '女';
      this.setState({userInfo, sex})
    }
  }

  onChange = (value) => {
    this.setState({
      value,
    })
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
          this.props.personalActions.queryPersonal({avatar: json.url});
          this.setState({
            picture: json.url
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

  selectAddress = () => {
    this.setState({visible: true})
  }

  setAddress = (result) => {
    let {selectedProvince, selectedCity, selectedCounty} = result;
    let areaCode = '';
    let province = '';
    let city = '';
    let block = '';
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
    this.props.personalActions.queryPersonal({province: province, city: city});
    this.setState({
      areaCode,
      province,
      city,
      block,
      visible: false
    })
  }

  onClose = () => {
    this.setState({visible: false})
  }

  exit = () => {
    this.setState({signOutVisible: true});
  }

  onCancel = () => {
    this.setState({signOutVisible: false});
  }

  signOut = () => {
    this.setState({signOutVisible: false});
    localStorage.removeItem('userInfo');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('password');
    hashHistory.replace('/home');
  }

  updatePersonal = (sexInfo) => {
    this.props.personalActions.queryPersonal({sex: sexInfo[0]});
    this.setState({sex: sexInfo[0] === 'MALE' ? '男' : '女'});
  }


  render() {
    const {userInfo, signOutVisible, visible, picture, sex, province, city} = this.state;
    const phone = userInfo.mobile !== undefined ? userInfo.mobile.replace(/^(\w{3})\w{4}(.*)$/, '$1***$2') : '';
    const TIPS = SignOutTips;
    return (
      <div>
        {
          this.state.uploading && <Loading />
        }
        <SetHelmet title="个人资料"/>
        <GoBack name="个人资料"/>
        <div className={`ver-center ${styles.avatorWrapper}`}>
          <label htmlFor="refundFile" className={styles.filelabel}/>
          <input ref="uploadFile"
                 className={styles.fileinput}
                 type="file"
                 accept="image/*"
                 id="refundFile"
                 onChange={this.handleUpload.bind(this)}/>
          <div className={styles.avator}>
            <img src={picture ? picture : userInfo ? userInfo.avatar : ''} alt=""/>
          </div>
          <div className={styles.rightCon}>
            <div>
              <span>修改头像</span>
              <i className="arrow-right"/>
            </div>
          </div>
        </div>
        <div className={styles.userWrapper}>
          <Link className={`ver-center border-bottom ${styles.con_1}`} to="/mine/personal/edit_name">
            <div className={styles.leftCon}>用户名</div>
            <div className={styles.rightCon}>
              <span>{userInfo ? userInfo.nickName : ''}</span>
              <i className="arrow-right"/>
            </div>
          </Link>
          <Picker data={sexSelect} cols={1} extra={<div style={{fontSize: '.3rem '}}>{sex ? sex : ''}</div>}
                  onChange={(v) => this.updatePersonal(v)}>
            <List.Item arrow="horizontal">
              <div style={{color: '#333333', fontSize: '.24rem', marginLeft: '.26rem'}}>性别</div>
            </List.Item>
          </Picker>

          <div className={`ver-center ${styles.con_1}`} onClick={this.selectAddress}>
            <div className={styles.leftCon}>所在地</div>
            <div className={styles.rightCon}>
              <span>{province ? province : userInfo ? userInfo.province : ''}</span>
              <span>{city ? city : userInfo ? userInfo.city : ''}</span>
              <i className="arrow-right"/>
            </div>
          </div>
        </div>
        <div className={styles.footWrapper}>
          <div className={`ver-center border-bottom ${styles.con_1}`}>
            <div className={styles.leftCon}>当前绑定手机</div>
            <div className={styles.phone}>{phone}</div>
          </div>
          <div className={`center-center-column ${styles.signOut}`} onClick={this.exit}>
            退出登录
          </div>
        </div>
        <SelectAddress setAddress={this.setAddress} visible={visible} onClose={this.onClose}/>
        <ConfirmModal
          visible={signOutVisible}
          tips={TIPS.tips}
          subTips={TIPS.subTips}
          confirmBtnText={TIPS.confirmBtnText}
          cancelBtnText={TIPS.cancelBtnText}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.signOut.bind(this)}/>
      </div>
    )

  }
}
const mapStateToProps = state => ({
  isFetching: state.personal.isFetching,
  sex: state.personal.sex
})

const mapDispatchToProps = dispatch => ({
  personalActions: bindActionCreators(PersonalAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Personal)
