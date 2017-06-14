/**
 * Created by HEro on 2017/5/27.
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as AccountActions from 'actions/AccountActions'
import {Toast} from 'antd-mobile'
import {hashHistory} from 'react-router'
import {LoginHeader, SetHelmet, Loading} from 'components'
import {RegExp, Constant} from 'service'
import styles from './index.scss'

class Reset extends Component {

  constructor(props) {
    super(props);
    this.timer = null;
    this.state = {
      mobile: '',
      password: '',
      verifyCode: '',
      vcType: 'RESET',
      vcTimer: 60,
      ready: true
    }
  }

  componentWillReceiveProps(nextProps) {
    const {isGetCode} = nextProps;
    if (isGetCode) {
      this._setInterval();
      this.props.accountActions.accountEnd()
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
    const {mobile, password, verifyCode} = this.state;
    let res = null;
    if (!RegExp.isMobile(mobile)) {
      res = "请输入正确手机号"
    } else if (!password || password.length < 6 || password.length > 15) {
      res = "请输入密码（6-15字符）"
    } else if (!verifyCode) {
      res = "请输入验证码"
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
    if (type === 'mobile' || type === 'verifyCode') {
      this.setState({[`${type}`]: RegExp.isLimitInput('account', value)});
    } else {
      this.setState({[`${type}`]: RegExp.isLimitInput(type, value)});
    }
  }

  onResetClick = (e) => {
    e.preventDefault();
    const formCheckRes = this.formCheck(this);
    let formData = this.state;

    if (formCheckRes === true) {
      this.props.accountActions.reset(formData.mobile, formData.password, formData.verifyCode)
    } else {
      Toast.info(formCheckRes)
    }
  }

  back = () => {
    hashHistory.goBack();
  }

  back2 = () => {
    hashHistory.go(-2);
  }

  render() {
    const {ready, vcTimer, mobile, verifyCode, password} = this.state;
    const verifyCodeText = ready ? '获取' : vcTimer + 's';
    return (
      <div className={`pageBackground ${styles.root}`}>
        {
          this.props.isFetching && <Loading />
        }
        <SetHelmet title="重设密码"/>
        <LoginHeader back={::this.back2}/>
        <div className={styles.inputPanel}>
          <div className={styles.phone}>
            <div className={styles.searchInput}>
              <span className="ver-center">
                <img src={require("../../../images/login&register/login_register_icon_phone.png")}
                     alt=""/>
              </span>
              <input type="text" placeholder="注册手机号" maxLength="11" ref="mobileInput"
                     value={mobile} onChange={this.handleInput.bind(this, 'mobile')}/>
            </div>
          </div>
          <div className={styles.yanzheng}>
            <div className={styles.searchInput}>
              <span className="ver-center">
                <img
                  src={require("../../../images/login&register/login_register_icon_securitycode.png")}
                  alt=""/>
              </span>
              <input type="text" maxLength="6" placeholder="请输入验证码" value={verifyCode}
                     onChange={this.handleInput.bind(this, 'verifyCode')}/>
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
              <input type="password" ref="password" maxLength="15" placeholder="新密码（6-15字符）"
                     value={password} onChange={this.handleInput.bind(this, 'password')}/>
            </div>
          </div>
          <div className={styles.resetBtn} onClick={this.onResetClick.bind(this)}>
            重设密码
          </div>
        </div>
        <div className={styles.backLoginPanel}>
        <span className={styles.backLogin} onClick={::this.back}>
          返回登录<i className="arrow-right"/>
        </span>
        </div>
      </div>
    )
  }
}


const mapStateToProps = state => ({
  isFetching: state.account.isFetching,
  isGetCode: state.account.isGetVerification
})

const mapDispatchToProps = dispatch => ({
  accountActions: bindActionCreators(AccountActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Reset)