/**
 * Created by yiwu on 2017/2/20.
 */
import React, {Component} from 'react'
import {GoBack, FooterBox, SetHelmet} from 'components'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {RegExp} from 'service'
import {Toast} from 'antd-mobile'
import * as PersonalAction from 'actions/PersonalActions'
import styles from './index.scss'

class EditName extends Component {

  state = {
    nickName: ''
  }

  componentDidMount() {
    if (localStorage.userInfo) {
      let userInfo = JSON.parse(localStorage.userInfo);
      let nickName = userInfo.nickName;
      this.setState({nickName})
    }
  }

  nameChange = (e) => {
    let nickName = e.target.value;
    this.setState({nickName})
  }

  editName = () => {
    const {nickName} = this.state;
    if (nickName) {
      if (RegExp.isNickName(nickName)) {
        this.props.personalActions.queryPersonal({nickName});
      } else {
        Toast.info('请输入正确的格式');
      }
    }
  }


  render() {
    const {nickName} = this.state;
    return (
      <div>
        <SetHelmet title="修改用户名"/>
        <GoBack name="修改用户名"/>
        <div className={styles.refundmoney}>
          <input type="text" value={nickName} maxLength="25" onChange={this.nameChange} placeholder="只支持英文、数字、汉字、下划线"/>
        </div>
        <p className={`font-24 ${styles.prompting}`}>
          每个用户只可以修改一次用户名哦
        </p>
        <FooterBox handleClick={this.editName} name="保存"/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.personal.isFetching,
})

const mapDispatchToProps = dispatch => ({
  personalActions: bindActionCreators(PersonalAction, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(EditName)
