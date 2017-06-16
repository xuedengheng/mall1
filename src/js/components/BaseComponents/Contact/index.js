/**
 * Created by Ben on 2017/4/14.
 */
import React from 'react';
import {Popup} from 'antd-mobile'
import styles from './index.scss'

const  Contact = () => {
    return (
        <div className={styles.root}>
            <div className={styles.detail}>
                <p className="font-26">关注我们获取24小时在线客服</p>
                <div className={styles.qrcode}>
                    <img src={require('../../../../images/base/erweima.png')} alt=""/>
                </div>
                <p>
                    <span className="font-24 color8282">微信号：</span>
                    <span className="font-24 color-fc6">易物网服务中心</span>
                </p>
                <p>
                    <span className="font-24 color8282">客服电话：</span>
                    <span className="font-24 color-fc6">020-330456</span>
                </p>
            </div>
            <div className={styles.cancel} onClick={() => Popup.hide()}>
                <span className="font-32">取消</span>
            </div>
        </div>
    )
}

export default Contact;