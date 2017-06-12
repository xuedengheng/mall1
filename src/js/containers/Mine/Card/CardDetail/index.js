/**
 * Created by Ben on 2016/12/11.
 */
import React, {Component} from 'react'
import {Toast} from 'antd-mobile'
import {GoBack, Loading, FooterBox, SetHelmet} from 'components'
import * as EwuCardActions from 'actions/EwuCardActions';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import styles from './index.scss';
import {urlApi, Tool} from 'service'


class CardDetail extends Component {

  state = {
    cardPassword: null
  }

  componentDidMount() {
    const {id} = this.props.params;
    this.props.EwuCardActions.queryCardDetail(id);
  }

  setStatusValue = (status) => {
    switch (status) {
      case "Disabled" :
        return '未使用';
      case "Generated" :
        return '未使用';
      case "Actived" :
        return '未使用';
      case "Purchased":
        return '未使用';
      case "Applied" :
        return '已使用';
      case "Expired" :
        return '已过期';
      default:
        return null
    }
  }

  // showPass = (data) => {
  //   console.log(Tool.encrypt(data))
  // }

  nowuse = () => {
    Toast.info('暂不支持易点充值')
  }

  render() {
    const {isFetching, detail} = this.props;

    return (
      <div className={styles.root}>
        <SetHelmet title="易物卡详细"/>
        {isFetching && <Loading />}
        <GoBack name="易物卡详细"/>
        <div className={styles.public}>
          <div className={styles.line}>
            <p className={styles.left}>卡状态</p>
            <p className={styles.right}>
              {this.setStatusValue(detail.status)}
            </p>
          </div>
          <div className={styles.line}>
            <p className={styles.left}>卡面值</p>
            <p className={styles.right}>{parseFloat(detail.amount).toFixed(2)}</p>
          </div>
          <div className={styles.line}>
            <p className={styles.left}>卡号</p>
            <p className={styles.right}>{detail.cardId}</p>
          </div>
          <div className={styles.line}>
            <p className={styles.left}>卡密码</p>
            <p className={styles.rightP}
               onClick={this.showPass}>
              {detail.cardPassword ? '点击查看密码' : detail.cardPassword }</p>
          </div>
          <div className={styles.line}>
            <p className={styles.left}>获取日期</p>
            <p className={styles.right}>{detail.extInfo && detail.extInfo.purchasedDate}</p>
          </div>

          {
            detail.status === 'Purchased' ?

              <FooterBox name="立即使用" handleClick={this.nowuse}/>
              :
              <div>
                <div className={styles.line}>
                  <p className={styles.left}>使用日期</p>
                  <p className={styles.right}>{detail.extInfo && detail.extInfo.appliedDate}</p>
                </div>
                <div className={styles.line}>
                  <p className={styles.left}>使用用户</p>
                  <p className={styles.right}>{detail.extInfo && detail.extInfo.appliedBy}</p>
                </div>
              </div>
          }

        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isFetching: state.ewuCard.isFetching,
  detail: state.ewuCard.detail
})

const mapDispatchToProps = dispatch => ({
  EwuCardActions: bindActionCreators(EwuCardActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardDetail)
