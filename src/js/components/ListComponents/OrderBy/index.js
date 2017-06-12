/**
 * Created by Ben on 2017/1/5.
 */
import React from 'react';
import styles from './index.scss'

class OrderBy extends React.Component{
    state = {
        selected: 'id',
        priceType: ''
    }

    changeSelected = (selected) => {
        const {handleClick} = this.props;
        if (selected === 'price') {
            switch (this.state.priceType) {
                case 'down':
                    this.setState({
                        selected,
                        priceType: 'up'
                    })
                    handleClick(selected, 'ASC');
                    break;
                case 'up':
                    this.setState({
                        selected,
                        priceType: 'down'
                    });
                    handleClick(selected, 'DESC');
                    break;
                default:
                    this.setState({
                        selected,
                        priceType: 'up'
                    })
                    handleClick(selected, 'ASC');
                    break;
            }
        } else {
            this.setState({
                selected,
                priceType: ''
            })
            handleClick(selected, 'DESC')
        }
    }

    changePriceType = (type) => {
        switch (type) {
            case 'down':
                return styles.down
            case 'up':
                return styles.up
            default:
                return styles.default
        }
    }

    render() {
        const { selected, priceType } = this.state;
        return (
            <div className={styles.root}>
                <div className={styles.panel} onClick={this.changeSelected.bind(this, 'id')}>
                    <p className={`${styles.font} ${selected==='id' ? styles.active : ''}`}>
                        默认
                    </p>
                </div>
                <div className={styles.panel} onClick={this.changeSelected.bind(this, 'price')}>
                    <p className={`${styles.font} ${selected==='price' ? styles.active : ''}`}>
                        价格
                        <i className={this.changePriceType(priceType)}/>
                    </p>
                </div>
                <div className={styles.panel} onClick={this.changeSelected.bind(this, 'sell_count')}>
                    <p className={`${styles.font} ${selected==='sell_count' ? styles.active : ''}`}>
                        畅销
                    </p>
                </div>
            </div>
        )
    }
}
export default OrderBy;