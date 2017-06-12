import React from 'react';
import {hashHistory} from 'react-router'
import styles from './index.scss';

const GoBack = props => {
    const {name, bottom, search, clickName, handleClick, goBack} = props;
    return (
        <div className={styles.title}>
            <div className={`fixed-top ver-center ${styles.content} ${
                bottom === "true" ? 'border-bottom' : ''
                } `}>
                <div className={`center-center ${styles.back}`} onClick={goBack ? goBack : () => {
                        hashHistory.goBack()
                    }}>
                    <img src={require('../../../../images/base/search_icon_back.png')} alt=""/>
                </div>
                <p className="text-center font-32 text-overflow-1">
                    {name}
                </p>
                {
                    search ?
                        <div className={`center-center ${styles.order}`} onClick={handleClick}>
                            <img src={require('../../../../images/base/order_salesreturn_icon_search.png')}/>
                        </div>
                        : ''
                }
                {
                    clickName && handleClick ?
                        <div className={`center-center ${styles.order}`} onClick={handleClick}>
                            <span className="font-32">
                                {clickName}
                            </span>
                        </div> : ''
                }
            </div>
        </div>
    )

};

export default GoBack