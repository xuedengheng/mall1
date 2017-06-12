/**
 * Created by Ben on 2017/3/7.
 */
import React from 'react'
import {Link, hashHistory} from 'react-router'
import styles from './index.scss'

const FixHeader = ({hightLight}) => {
    return (
        <div className={styles.root}>
            <div>
                <div className={`${styles.back} ${styles.bg}`} style={{background: '#7f7f7f'}} onClick={() => {
                    hashHistory.goBack()
                }}>
                    <img className="img-responsive"
                         src={require(`../../../../images/product/goods_icon_arrowback${hightLight ? '_highlighted' : ''}.png`)}
                         alt=""/>
                </div>
            </div>
            <div className={styles.right}>
                <Link className={`block ${styles.cart} ${styles.bg}`} style={{background: '#7f7f7f'}} to="/cart/2">
                    <img className="img-responsive"
                         src={require(`../../../../images/product/goods_icon_car${hightLight ? '_highlighted' : ''}.png`)}
                         alt=""/>
                </Link>
                {/*<div className={`${styles.share} ${styles.bg}`} style={{background: '#7f7f7f'}}>*/}
                    {/*<img className="img-responsive"*/}
                         {/*src={require(`../../../../images/product/goods_icon_share${hightLight ? '_highlighted' : ''}.png`)}*/}
                         {/*alt=""/>*/}
                {/*</div>*/}
            </div>
        </div>
    )
}
export default FixHeader