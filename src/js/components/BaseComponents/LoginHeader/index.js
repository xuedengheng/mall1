/**
 * Created by Ben on 2017/1/10.
 */
import React from 'react'
import styles from './index.scss'

const LoginHeader = props => {
    const { back } = props

    return (
        <div className={styles.showPanel}>
            <div className={styles.close} onClick={back}>
                <span>关闭</span>
            </div>
            <div className={styles.iconPanel}>
                <img src={require('../../../../images/login&register/login_icon.png')}
                     width="105" height="105" className="block" alt=""/>
            </div>
        </div>
    )
}

export default LoginHeader;