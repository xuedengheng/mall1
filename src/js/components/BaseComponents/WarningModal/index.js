/**
 * Created by Administrator on 2017/6/6.
 */
import React, {Component} from 'react';
import _ from 'lodash';
import styles from './index.scss';

class WarningModal extends Component {
  constructor(props) {
    super(props);
    this.animationEnd = this.animationEnd.bind(this);
    this.state = {
      isShow: false,
      animationType: "leave"
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
        isShow: false
      })
    }
  }

  render() {
    const {onCancel, onRemove, orderData, notValid} = this.props;
    const {isShow, animationType} = this.state;
    const style = {
      display: isShow ? '' : 'none',
      WebkitAnimationDuration: '300ms',
      animationDuration: '300ms'
    }
    return (
      <div className={`${styles.fixBg} rodal-fade-${animationType} `} style={style}
           onAnimationEnd={this.animationEnd}>
        <div className={styles.mask} onClick={onCancel}/>
        <div className={styles.popupBg}>
          <p className={`font-28 ${styles.warningtitle}`}>抱歉，以下商品已失效</p>
          <div className={styles.warninglist}>
            <ul className={styles.warningul}>
              {orderData && orderData.map(item => {
                return (item.cartDetails && item.cartDetails.map(sku => {
                  return (
                    (notValid && _.findIndex(notValid, id => id === sku.cartDetailId) > -1 ) &&
                    <li className={styles.warningli}>
                      <div className={styles.warningpic}>
                        <img src={sku.picture} alt=""/>
                      </div>
                      <div className={styles.listdetail}>
                        <p className={`text-overflow-2 color333 font-20 ${styles.goodsname}`}>
                          {sku.productName}
                        </p>
                        <p className={`color666 font-20`}>规格：{sku.productAttr}</p>
                      </div>
                    </li>
                  )
                }))
              })}
            </ul>
          </div>
          <div className={styles.footerbtn}>
            <div className={styles.cancelbtn} onClick={onCancel}>取消</div>
            <div className={styles.removebtn} onClick={onRemove}>移除失效商品</div>
          </div>
        </div>
      </div>
    )
  }
}

export default WarningModal