/**
 * Created by Ben on 2017/1/4.
 */
import React from 'react'
import { Link } from 'react-router'
import styles from './index.scss'

const StaticSearch = (props) => {
    return (
        <div className={styles.root}>
            <div className={styles.hardHeight}></div>
            <div className={`fixed-top ${styles.panel}`}>
                <div className={`center-center ${styles.back}`} onClick={props.back}>
                    <img src={require('../../../../images/base/search_icon_back.png')} className="img-responsive"/>
                </div>
                <Link className={styles.search} to="/search" >
                    <i className={styles.searchIcon} />
                    <span className={`font-28 ${styles.font}`}>商品名 品牌 类目</span>
                </Link>
            </div>
        </div>
    )
}
export default StaticSearch;