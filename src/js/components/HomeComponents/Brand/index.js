/**
 * Created by Ben on 2016/12/21.
 */
import React from 'react';
import {LazyLoadComponent} from 'components'
import Title from '../Title'
import styles from './index.scss'

const Brand = (props) => {
    const {data, icon, title, targetClick} = props;
    let list =
        <div className={styles.panel}>
            {
                data.map((item, index) =>
                    <div className={styles.brandItem} onClick={targetClick.bind(this, item.target, item.id)}
                         key={index}>
                        <div className={styles.imgDiv}>
                            <LazyLoadComponent>
                                <img src={item.url} className="img-responsive"/>
                            </LazyLoadComponent>
                        </div>
                    </div>
                )
            }
        </div>


    return (
        <div className={styles.root}>
            {
                title !== '' ? <Title title={title} icon={icon}/> : ''
            }
            {list}
        </div>
    )
}

export default Brand;
