/**
 * Created by Ben on 2017/5/26.
 */
import React, {Component} from 'react'
import styles from './index.scss'

class PromotionsModal extends Component {
  constructor(props) {
    super(props);
    this.animationEnd = this.animationEnd.bind(this);
    this.state = {
      isShow: false,
      animationType: 'leave',
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
      animationType: 'leave',
    })
  }

  animationEnd() {
    if (this.state.animationType === 'leave') {
      this.setState({
        isShow: false
      });
    }
  }

  render() {
    const {onClose, promotion} = this.props;
    const {isShow, animationType} = this.state;
    const style = {
      display: isShow ? '' : 'none',
      WebkitAnimationDuration: '300ms',
      animationDuration: '300ms'
    }
    return (
      <div className={`${styles.root} rodal-fade-${animationType}`} style={style}
           onAnimationEnd={this.animationEnd}>
        <div className={styles.mark} onClick={onClose}/>
        <div className={`${styles.container} rodal-popup-${animationType}`}>
          <div className={styles.header}>
            优惠
            <div className={styles.close} onClick={onClose}>
              <div className={styles.closeWrapper}>
                <img src={require('../../../../images/submit_order/X.png')} alt=""/>
              </div>
            </div>
          </div>
          <div className={styles.content}>
            <ul>
              <li className={styles.activity}>
                <div className={styles.tagWrapper}>
                  <p className={styles.tag}>{promotion.label}</p>
                </div>
                <div className={styles.content}>
                  <p className={styles.name}>{promotion.name}</p>
                  <p className={styles.desc}>{promotion.description}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default PromotionsModal