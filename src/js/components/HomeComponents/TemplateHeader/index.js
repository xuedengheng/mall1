/**
 * Created by Ben on 2017/1/12.
 */
import React from 'react'
import styles from './index.scss'

const TemplateHeader = props => {
    const { title, back } = props

    return (
        <div className={styles.root}>
            <div className={styles.fixedHeight}></div>
            <div className={styles.fixedTop}>
                <div onClick={back} className={`ver-center ${styles.back}`}>
                    <img src={require('../../../../images/base/search_icon_back.png')} alt=""/>
                </div>
                <p>{title}</p>
            </div>
        </div>
    )
}

export default TemplateHeader