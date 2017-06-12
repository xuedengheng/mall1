/**
 * Created by Ben on 2017/3/16.
 */
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import styles from './index.scss'
import {
  GoBack,
  SplitLine
} from 'components'

class AddressSelect extends Component {
  constructor(props) {
    super(props)
    this.animationEnd = this.animationEnd.bind(this);
    this.state = {
      isShow: false,
      animationType: 'leave'
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

  handleClick = () => {
    hashHistory.push({
      pathname: '/mine/address'
    })
  }

  render() {
    const {close, addresses, handleClick} = this.props;
    const {isShow, animationType} = this.state;
    const style = {
      display: isShow ? '' : 'none',
      WebkitAnimationDuration: '300ms',
      animationDuration: '300ms'
    }
    return (
      <div className={`${styles.container} rodal-popleft-${animationType}`} style={style}
           onAnimationEnd={this.animationEnd}>
        <GoBack name="选择收货地址" goBack={close} clickName="管理" bottom="true" handleClick={this.handleClick}/>
        <SplitLine />
        {
          addresses && addresses.map((item, index) =>
            <li className={styles.addressItem} key={index} onClick={handleClick.bind(this, item)}>
              <div className={styles.addressLink}>
                <div className={styles.leftContent}>
                  <div className={styles.header}>
                    <p className={styles.name}><span
                      className={styles.active}>{item.defaultFlag === 'Y' ? '[默认]' : ''}</span>收货人：{item.name}</p>
                    <p className={styles.phone}>{item.mobile}</p>
                  </div>
                  <div className={`${styles.address} text-overflow-2`}>
                    收货地址：{`${item.province}${item.city}${item.block}${item.town}${item.street}${item.address}`}
                  </div>
                  {
                    item.identityId && <div className={styles.idNo}>
                      身份证号：{item.identityId.replace(/^(\w{3})\w{11}(.*)$/, '$1******$2')}
                    </div>
                  }
                </div>
                <div className={styles.rightContent}>
                  <i className={item.checked ? 'check' : ''}/>
                </div>
              </div>
            </li >
          )
        }
      </div>
    )
  }
}
export default AddressSelect