/**
 * Created by Ben on 2017/1/11.
 */
import React from 'react'
import styles from './index.scss'
import {Link} from 'react-router'

const MyOrder = () => {
    return (
        <Link className={styles.root} to="mine/order/1000?from=mine">
            <div className={styles.title}>
                <i/>我的订单
            </div>
            <div className={styles.entry}>
                全部订单<i className="arrow-right"/>
            </div>
        </Link>
    )
}

export default MyOrder