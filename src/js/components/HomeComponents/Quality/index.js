/**
 * Created by Ben on 2016/12/22.
 */
import React from 'react'
import { LazyLoadComponent } from 'components'
import Title from '../Title'
import styles from './index.scss'

const Quality = (props) => {
    const { data, icon, title, targetClick } = props
    let list1 = [];
    let list2 = [];
    data.map((item, index) => {
        switch (index) {
            case 0:
                list1.push(
                    <div className={styles.big} key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                        <LazyLoadComponent>
                                <img src={item.url} className={styles.pic} width="354" height="200"/>
                        </LazyLoadComponent>
                    </div>
                );
                break;
            case 1:
                list2.push(
                    <div className={styles.big} key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                        <div className={styles.imgDiv}>
                            <LazyLoadComponent>
                                <img src={item.url} className={styles.pic} width="354" height="200"/>
                            </LazyLoadComponent>
                        </div>
                    </div>
                );
                break;
            case 2:
                list1.push(
                    <div className={styles.small} key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                        <div className={styles.imgDiv}>
                            <LazyLoadComponent>
                                <img src={item.url} className={styles.pic} width="172" height="180"/>
                            </LazyLoadComponent>
                        </div>
                    </div>
                );
                break;
            case 3:
                list1.push(
                    <div className={styles.small} key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                        <div className={styles.imgDiv}>
                            <LazyLoadComponent>
                                <img src={item.url} className={styles.pic} width="172" height="180"/>
                            </LazyLoadComponent>
                        </div>
                    </div>
                );
                break;
            case 4:
                list2.push(
                    <div className={styles.small} key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                        <div className={styles.imgDiv}>
                            <LazyLoadComponent>
                                <img src={item.url} className={styles.pic} width="172" height="180"/>
                            </LazyLoadComponent>
                        </div>
                    </div>
                );
                break;
            case 5:
                list2.push(
                    <div className={styles.small} key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                        <div className={styles.imgDiv}>
                            <LazyLoadComponent>
                                    <img src={item.url} className={styles.pic} width="172" height="180"/>
                            </LazyLoadComponent>
                        </div>
                    </div>
                );
                break;
        }
    })
    return(
        <div className={styles.root}>
            {
                title !== '' ? <Title title={title} icon={icon} /> : ''
            }
            <div className={styles.panel}>
                <div className={styles.list}>
                    {list1}
                </div>
                <div className={styles.list}>
                    {list2}
                </div>
            </div>
        </div>
    )
}

export default Quality