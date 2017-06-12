/**
 * Created by Ben on 2017/1/10.
 */
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {LoginHeader, Loading, SetHelmet} from 'components'
import {Toast} from 'antd-mobile'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as AccountActions from 'actions/AccountActions'
import {RegExp, urlApi} from 'service'
import styles from './index.scss'

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      account: localStorage.account ? localStorage.account : '',
      password: ''
    }
  }

  componentWillMount() {
    this.props.accountActions.accountEnd();
  }

  back = () => {
    hashHistory.goBack();
  }

  formCheck() {
    let account = this.state.account;
    let password = this.state.password;

    let res = null;

    if (!RegExp.isMobile(account)) {
      res = "请输入正确手机号"
    } else if (password === '' || password.length < 6 || password.length > 15) {
      res = "请输入密码（6-15字符）"
    } else {
      res = true
    }

    return res
  }

  handleInput = (type, e) => {
    // 判断 value 是否符合规则
    let value = e.target.value;
    this.setState({[`${type}`]: value});
  }

  login = () => {
    const {account, password} = this.state;
    let formCheckRes = this.formCheck(this);
    if (formCheckRes === true) {
      let params = {
        url: urlApi.auth.getToken,
        search: {
          account,
          password: btoa(password),
          ipAddr: ip
        }
      };
      this.props.accountActions.login(params)
    } else {
      Toast.info(formCheckRes)
    }

  }

  render() {
    const {account, password} = this.state;
    const {isFetching} = this.props;
    return (
      <div className={`pageBackground ${styles.root}`}>
        <SetHelmet title="登录"/>
        {
          isFetching && <Loading />
        }
        <div className={styles.content}>
          <LoginHeader back={this.back}/>
          <div className={styles.inputPanel}>
            <div className={styles.username}>
              <div className={styles.searchInput}>
                            <span className="ver-center">
                                <img src={require("../../../images/login&register/login_icon_user.png")} alt=""/>
                            </span>
                <input type="text" ref="username" placeholder="手机号" onChange={this.handleInput.bind(this, 'account')}
                       value={account}/>
              </div>
            </div>
            <div className={styles.password}>
              <div className={styles.searchInput}>
                            <span className="ver-center">
                                <img src={require("../../../images/login&register/login_icon_password.png")} alt=""/>
                            </span>
                <input type="password" ref="password" placeholder="登录密码"
                       onChange={this.handleInput.bind(this, 'password')} value={password}/>
              </div>
            </div>
            <div className={`space-between ${styles.otherCtrl}`}>
              <Link to="/reset">
                忘记密码
              </Link>
              <Link to="/register">
                立即注册
              </Link>
            </div>
            <div className={styles.loginBtn} onClick={this.login}>
              登录
            </div>
          </div>
        </div>
        <div className={styles.advPanel}>
          <div className={styles.adv}>
            <img src={require('../../../images/base/refresh_text.png')} alt="" className="img-responsive"/>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.account.isFetching,
  login: state.account.login
})

const mapDispatchToProps = dispatch => ({
  accountActions: bindActionCreators(AccountActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)


/*微信登录模板
 * <div className={styles.wxloginPanel}>
 <div className={styles.wxlogin}>
 <img src={require('../../../images/login&register/login_icon_wechat.png')} alt=""/>
 <p>微信登录</p>
 </div>
 </div>
 * */