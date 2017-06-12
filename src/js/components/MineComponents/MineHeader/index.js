/**
 * Created by Ben on 2017/1/11.
 */
import React from 'react';
import { Link } from 'react-router'
import styles from './index.scss';

const MineHeader = () => {
    let userInfo = localStorage.userInfo ? JSON.parse(localStorage.userInfo) : {}
    return (
        <Link className={styles.root} to="mine/personal">
            <div className={styles.avator}>
                <img src={userInfo.avatar} alt=""/>
            </div>
            <p>{userInfo.nickName}</p>
            <div className={styles.arrowPanel}>
                <div className={styles.arrowRight}>
                    <img src={require('../../../../images/mine/mine_icon_arrowright_white.png')} alt="" />
                </div>
            </div>
        </Link>
    )
}

export default MineHeader