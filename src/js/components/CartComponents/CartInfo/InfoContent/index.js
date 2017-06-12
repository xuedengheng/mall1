/**
 * Created by Ben on 2017/1/12.
 */
import React, {Component} from 'react'
import styles from './index.scss'

class InfoContent extends Component {
    state = {
        check: false,
    }

    handleClick = () => {
        if (this.state.check === true) {
            this.setState({
                check: false
            });
            this.props.handleClick(false)
        } else {
            this.setState({
                check: true
            })
            this.props.handleClick(true)
        }
    }

    componentWillReceiveProps(nexProps) {
        const {checkAll} = nexProps;
        if (checkAll === true && nexProps.checkAll !== this.props.checkAll) {
            this.setState({
                check: true
            })
        } else if (nexProps.checkAll === false && nexProps.checkAll !== this.props.checkAll) {
            this.setState({
                check: false
            })
        }
    }

    render() {
        const {check} = this.state;
        const {item} = this.props;

        return (
            <div className={styles.root}>
                <div className={`center-center ${styles.checkPanel}`} onClick={this.handleClick}>
                    {
                        check ?
                            <img src={require('../../../../../images/cart/car_icon_check_yes.png')} alt=""/>
                            :
                            <img src={require('../../../../../images/cart/car_icon_check_no.png')} alt=""/>
                    }
                </div>
                <div className={`ver-center ${styles.detail}`}>
                    <div className={styles.thumb}>
                        <img src={item.picture} alt="" className="img-responsive"/>
                    </div>
                    <div className={styles.info}>
                        <div className={styles.title}>
                            <p className={`text-overflow-1 font-24 ${!item.valid ? 'color8282' : 'color333'}`}>{item.productName}</p>
                            <p className="font-20 color8282">规格：{item.productAttr}</p>
                        </div>
                        <div className={`space-between ${styles.price}`}>
                            <p className={`font-32 ${!item.valid ? 'color8282' : 'color-fe5'}`}>
                                ¥{item.price}
                            </p>
                            {
                                item.valid ? <div className={styles.numCtrl}>
                                        <div className={`center-center ${styles.des}`}>
                                            <img src={require('../../../../../images/cart/car_count_icon_minus_lowlighted.png')}
                                                 alt=""/>
                                        </div>
                                        <div className={`center-center ${styles.num}`}>
                                            <span>{item.quantity}</span>
                                        </div>
                                        <div className={`center-center ${styles.add}`}>
                                            <img src={require('../../../../../images/cart/car_count_icon_add_highlighted.png')}
                                                 alt=""/>
                                        </div>
                                    </div>
                                    :
                                    <p className="font-24 color-fe5">{item.reason}</p>
                            }

                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default InfoContent;