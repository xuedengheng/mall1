import React, { Component } from 'react';
import styles from './index.scss';

const Loading = () => {
    return (
        <div className="center-center loading-page">
            <div className={styles.load}>
                <div className={styles.loader} />
                <div className={`absolute-center ${styles.imgPanel}`}>
                    <img src={require('../../../../images/base/loading_icon.png')} className="img-responsive"/>
                </div>
            </div>
        </div>
    )
};

export default Loading;