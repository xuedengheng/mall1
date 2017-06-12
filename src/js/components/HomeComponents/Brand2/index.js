/**
 * Created by Ben on 2016/12/23.
 */
import React from 'react';
import { Link } from 'react-router'
import { LazyLoadComponent } from 'components'
import Title from '../Title';
import styles from './index.scss'

const Brand2 = (props) =>{
    const { data } = props;
    let list =
        <div className={styles.panel}>
            {
                data.map((item, index) =>
                    <div key={index} className={styles.list}>
                        <LazyLoadComponent>
                            <img src={item.url} alt=""/>
                        </LazyLoadComponent>
                    </div>
                )
            }
        </div>

    return (
        <div className={styles.root}>
            <Title text="品牌馆" />
            {list}
        </div>
    )
}

export default Brand2;