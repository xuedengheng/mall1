/**
 * Created by Administrator on 2017/4/18.
 */
import React, {Component} from 'react';
import styles from './index.scss';

class ConfirmModal extends Component {
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

  handleCancel(e) {
    e.preventDefault();
    const {onCancel} = this.props;
    onCancel && onCancel()
  }

  handleConfirm(e) {
    e.preventDefault();
    const {onConfirm} = this.props;
    onConfirm && onConfirm()
  }

  render() {
    const {tips, subTips, onCancel, cancelBtnText, confirmBtnText} = this.props;
    const {isShow, animationType} = this.state;
    const style = {
      display: isShow ? '' : 'none',
      WebkitAnimationDuration: '300ms',
      animationDuration: '300ms'
    }
    return (
      <div className={`${styles.fixBg} rodal-fade-${animationType}`} style={style}
           onAnimationEnd={this.animationEnd}>
        <div className={styles.mask} onClick={onCancel}/>
        <div className={styles.popupBg}>
          <div className={styles.content}>
            <p className={styles.pointTxt}>{tips}</p>
            {
              subTips &&
                <p className={styles.pointTxtDB}>{subTips}</p>
            }
          </div>
          {
            onCancel ?
              <div className={styles.TButtom}>
                <span className={styles.cencelBottom}
                    onClick={this.handleCancel.bind(this)}>{cancelBtnText || '取消'}</span>
                <span className={styles.sureBottom}
                      onClick={this.handleConfirm.bind(this)}>{confirmBtnText || '确认'}</span>
              </div>
              :
              <div className={styles.TButtom}>
                <span className={styles.sureButton}
                      onClick={this.handleConfirm.bind(this)}>{confirmBtnText || '确认'}</span>
              </div>
          }
        </div>
      </div>
    )
  }
}

export default ConfirmModal