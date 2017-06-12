/**
 * Created by Ben on 2016/12/14.
 */
import React, { Component } from 'react';
import styles from './index.scss';
import { api } from 'service'

export default class FreePostage extends Component {
    render() {
        const { freightFreeThreshold,storeName } = this.props;
        let freightFree = api.handleFreightFree(freightFreeThreshold);
        return (
            <div className={styles.root}>
                <span className={styles.title}>包邮</span>
                {
                    freightFree === 0 ?
                        <span className="font-24 color000">{storeName}商品全场包邮</span>
                        :
                        <span className="font-24 color000">{storeName}订单满{freightFree}元包邮</span>
                }
            </div>
        )
    }
}