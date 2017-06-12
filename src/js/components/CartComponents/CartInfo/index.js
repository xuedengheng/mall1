/**
 * Created by Ben on 2017/1/12.
 */
import React from 'react'
import styles from './index.scss'
import InfoContent from './InfoContent'

class CartInfo extends React.Component {
    index = 0;
    state = {
        check: false,
        checkAll: false,
    }

    handleChange = () => {
        const { cartDetailList } = this.props.data
        if (!this.state.checkAll) {
            this.index = cartDetailList.length
            this.setState({
                check: true,
                checkAll: true,
            })
        } else {
            this.index = 0;
            this.setState({
                check: false,
                checkAll: false,
            })
        }
    }

    handleClick = (check) => {
        const { cartDetailList } = this.props.data
        if(check) {
            this.index ++;
            if (this.index === cartDetailList.length) {
                this.setState({
                    checkAll: true,
                    check: true
                })
            }
        } else if (this.index > 0) {
            this.index --;
            if (this.index === 0) {
                this.setState({
                    check: false,
                    checkAll: false
                })
            } else {
                this.setState({
                    check: false
                })
            }
        }
    }

    render() {
        const { checkAll, check } = this.state;
        const { data, index } = this.props;
        let view = [];
        if (data.cartDetailList.length > 0) {
            data.cartDetailList.map((item, i) => {
                view.push(
                    <InfoContent key={i} checkAll={checkAll} handleClick={this.handleClick} item={item}/>
                )
            })
        }

        return (
            <div className={styles.root}>
                <div className={`ver-center ${styles.header}`}>
                    <div className={`center-center ${styles.checkPanel}`} onClick={this.handleChange.bind(this)}>
                        {
                            check ?
                                <img src={require('../../../../images/cart/car_icon_check_yes.png')} alt=""/>
                                    :
                                <img src={require('../../../../images/cart/car_icon_check_no.png')} alt=""/>
                        }
                    </div>
                    <div className={`ver-center ${styles.title}`}>
                        <span className="font-28 color333">{data.storeName}发货</span>
                    </div>
                </div>
                {view}
            </div>
        )
    }
}

export default CartInfo