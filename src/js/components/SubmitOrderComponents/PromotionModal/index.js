/**
 * Created by Ben on 2017/3/14.
 */
import React, {Component} from 'react'
import styles from './index.scss'

const USE = 1;
const NOUSE = 0;

class PromotionModal extends Component {
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
        const {isShow, animationType} = this.state;
        const {activityStatus, activityDetail, close, handleClick} = this.props;
        const style = {
            display: isShow ? '' : 'none',
            WebkitAnimationDuration: '300ms',
            animationDuration: '300ms'
        }
        return (
            <div className={`${styles.root} rodal-fade-${animationType}`} style={style}
                 onAnimationEnd={this.animationEnd}>
                <div className={`${styles.container} rodal-popup-${animationType}`}>
                    <div className={styles.header}>
                        {
                            (activityDetail && activityDetail.type === "DEDUCTION") ? '活动优惠' : '新人活动'
                        }
                        <div className={styles.close} onClick={close}>
                            <div className={styles.closeWrapper}>
                                <img src={require('../../../../images/submit_order/X.png')} alt=""/>
                            </div>
                        </div>
                    </div>
                    <div className={styles.content}>
                        <ul>
                            {
                                activityDetail && activityDetail.promotionDiscounts.map((item, index) =>
                                    <li className={styles.activity} key={index}>
                                        <span className={styles.tag}>{item.label}</span>
                                        <span className={styles.desc}>{item.name}</span>
                                        <span className={styles.decount}>- ¥ {parseFloat(item.discountAmount).toFixed(2)}</span>
                                    </li>
                                )
                            }
                        </ul>
                    </div>
                    <div className={styles.footer}>
                        {
                            (activityDetail && activityStatus > -1) &&
                            <div className={styles.nouse}
                                 onClick={handleClick.bind(this, activityDetail.type, NOUSE)}>
                                <span>不使用优惠</span>
                            </div>
                        }
                        {
                            (activityDetail && activityStatus === -1) &&
                            <div className={styles.nouse}
                                 onClick={handleClick.bind(this, activityDetail.type, USE)}>
                                <span>使用优惠</span>
                            </div>
                        }
                    </div>
                </div>
            </div>
        )
    }
}
export default PromotionModal