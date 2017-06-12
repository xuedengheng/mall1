/**
 * Created by Ben on 2017/4/13.
 */
import React from 'react'
import {STATS} from 'react-pullload'
import {Icon} from 'antd-mobile'
import styles from './index.scss'

const HeaderNode = ({loaderState}) => {
    let content = '';
    if (loaderState == STATS.pulling) {
        content = '下拉刷新';
    } else if (loaderState == STATS.enough) {
        content = '松开刷新';
    } else if (loaderState == STATS.refreshing) {
        content = '正在刷新';
    } else if (loaderState == STATS.refreshed) {
        content = '刷新成功';
    }
    return (
        <div className={styles.root}>
            <p>
                <img className={styles.refreshText} src={require('../../../../images/base/refresh_text.png')} alt=""/>
            </p>
            <p className={styles.status}>
                {
                    (loaderState == STATS.pulling || loaderState == STATS.enough) &&
                    <span className={`${styles.icon} ${loaderState == STATS.enough ? styles.enough : ''}`}>
                        <img src={require('../../../../images/base/refresh_icon_arrow.png')} alt=""/>
                    </span>
                }
                {
                    loaderState == STATS.refreshing &&
                        <span className={styles.icon}>
                            <Icon type="loading"/>
                        </span>
                }
                {
                    loaderState == STATS.refreshed &&
                        <span className={styles.icon}>
                            <Icon type="check-circle-o"/>
                        </span>
                }
                <span>{content}</span>
            </p>
        </div>
    )
}

export default HeaderNode