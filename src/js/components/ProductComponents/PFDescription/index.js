/**
 * Created by Ben on 2016/12/13.
 */
import React, { Component } from 'react'
import { api } from 'service'
import styles from './index.scss'

const PFDescription = props => {
    const { storeName, introduce } = props;

    return (
        <div className={styles.root}>
            <span className={styles.pfName}>[{storeName}]</span>
            <span className="font-24">{introduce}</span>
        </div>
    )
}

export default PFDescription;