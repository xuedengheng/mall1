/**
 * Created by Ben on 2017/1/10.
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {hashHistory} from 'react-router'
import * as AccountActions from 'actions/AccountActions'
import {Toast} from 'antd-mobile'
import {LoginHeader, SetHelmet, Loading} from 'components'
import {RegExp, Constant} from 'service'
import styles from './index.scss'

const AGREE_URL = encodeURIComponent(`${Constant.CDN_HOST}/yiwu/agreement.html`);

class Register extends Component {

  constructor(props) {
    super(props);
    const {data} = props;
    let mobile = data ? data.mobile : '';
    let password = data ? data.password : '';
    let verifyCode = data ? data.verifyCode : '';
    let vcTimer = data ? data.vcTimer : 60;
    this.timer = null;
    this.state = {
      mobile: mobile ? mobile : '',
      password: password ? password :'',
      verifyCode: verifyCode ? verifyCode : '',
      isChecked: false,
      vcType: 'REG',
      vcTimer: vcTimer ? vcTimer : 60,
      ready: vcTimer ? vcTimer === 60 : true
    }
  }

  componentWillReceiveProps(nextProps) {
    const {isGetCode, data} = nextProps;
    if (isGetCode) {
      this._setInterval();
      this.props.accountActions.accountEnd()
    }
    if (data && data.vcTimer !== 60) {
      this.setState({vcTimer: data.vcTimer});
      if (data.vcTimer === 0) {
        this.setState({ready: true, vcTimer: 60})
      }
    }
  }

  componentWillUnmount() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null
    }
  }

  _setInterval = () => {
    this.timer && clearInterval(this.timer);
    this.timer = setInterval(() => {
      let vcTimer = this.state.vcTimer;
      this.setState({ready: false});
      vcTimer -= 1;
      if (vcTimer < 1) {
        this.setState({ready: true});
        vcTimer = 60;
        clearInterval(this.timer)
      }
      this.setState({vcTimer})
    }, 1000)
  }

  formCheck = () => {
    const {mobile, password, verifyCode, isChecked} = this.state;
    let res = null;

    if (!RegExp.isMobile(mobile)) {
      res = "请输入正确手机号"
    } else if (password === null || password.length < 6 || password.length > 15) {
      res = "请输入密码（6-15字符）"
    } else if (verifyCode === null) {
      res = "请输入验证码"
    } else if (!isChecked) {
      res = "请查看用户协议"
    } else {
      res = true
    }

    return res
  }

  onVerifyCodeClick = e => {
    e.preventDefault();
    const {mobile, ready, vcType} = this.state;

    if (ready) {
      if (!RegExp.isMobile(mobile)) {
        Toast.info('请输入正确的手机号码')
      } else {
        this.props.accountActions.getVerification(vcType, mobile);
      }
    }
  }

  handleInput = (type, e) => {
    // 判断 value 是否符合规则
    let value = e.target.value;
    this.setState({[`${type}`]: value});
  }

  toggleIsChecked = () => {
    this.setState({isChecked: !this.state.isChecked});
  }

  onRegisterClick = e => {
    e.preventDefault();
    const formCheckRes = this.formCheck(this);
    let formData = this.state;
    if (formCheckRes === true) {
      this.props.accountActions.register(formData.mobile, formData.password, formData.verifyCode)
    } else {
      Toast.info(formCheckRes)
    }
  }

  watchAgreePage = e => {
    e.preventDefault();
    let url = `/lnk?url=${AGREE_URL}`;
    let {mobile, password, verifyCode, vcTimer} = this.state;
    this.props.accountActions.saveRegisterData({mobile, password, verifyCode, vcTimer});
    hashHistory.push(url);
  }

  back2 = () => {
    this.props.accountActions.accountEnd();
    hashHistory.go(-2)
  }

  back = () => {
    this.props.accountActions.accountEnd();
    hashHistory.goBack()
  }

  render() {
    const {mobile, password, verifyCode, ready, vcTimer, isChecked} = this.state;
    const verifyCodeText = ready  ? '获取' : vcTimer + 's';

    return (
      <div className={`pageBackground ${styles.root}`}>
        {
          this.props.isFetching && <Loading />
        }
        <SetHelmet title="注册"/>
        <LoginHeader back={::this.back2}/>
        <div className={styles.inputPanel}>
          <div className={styles.phone}>
            <div className={styles.searchInput}>
                            <span className="ver-center">
                                <img src={require("../../../images/login&register/login_register_icon_phone.png")}
                                     alt=""/>
                            </span>
              <input type="text" placeholder="手机号" ref="mobileInput" value={mobile} onChange={this.handleInput.bind(this, 'mobile')}/>
            </div>
          </div>
          <div className={styles.yanzheng}>
            <div className={styles.searchInput}>
                            <span className="ver-center">
                                <img
                                  src={require("../../../images/login&register/login_register_icon_securitycode.png")}
                                  alt=""/>
                            </span>
              <input type="text" placeholder="请输入验证码" value={verifyCode} onChange={this.handleInput.bind(this, 'verifyCode')}/>
              <button className={styles.yanzheng} disabled={!ready} onClick={this.onVerifyCodeClick.bind(this)}>
                {verifyCodeText}
              </button>
            </div>
          </div>
          <div className={styles.password}>
            <div className={styles.searchInput}>
                            <span className="ver-center">
                                <img src={require("../../../images/login&register/login_icon_password.png")} alt=""/>
                            </span>
              <input type="password" ref="password" value={password} placeholder="登录密码（6-15字符）"
                     onChange={this.handleInput.bind(this, 'password')}/>
            </div>
          </div>
          <div className={styles.agree}>
                        <span className="font-26 color333" onClick={this.toggleIsChecked.bind(this)}>
                            <span className={styles.agreeBox}>
                            {
                              isChecked ?
                                <img src={require('../../../images/login&register/login_register_agree_yes.png')}
                                     alt=""/>
                                :
                                <img src={require('../../../images/login&register/login_register_agree_no.png')}
                                     alt=""/>
                            }
                            </span>
                            已阅读并同意
                        </span>
            <span onClick={this.watchAgreePage} className="font-26 color-fc6">《易物网用户协议》</span>
          </div>
          <div className={styles.registerBtn} onClick={this.onRegisterClick.bind(this)}>
            立即注册
          </div>
        </div>
        <div className={styles.backLoginPanel}>
                    <span className={styles.backLogin} onClick={::this.back}>
                        <i className="back-arrow"/>返回登录
                    </span>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.account.isFetching,
  isGetCode: state.account.isGetVerification,
  data: state.account.registerParams
})

const mapDispatchToProps = dispatch => ({
  accountActions: bindActionCreators(AccountActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Register)