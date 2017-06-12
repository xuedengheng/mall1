/**
 * Created by Ben on 2016/12/22.
 */
import React from 'react'
import { LazyLoadComponent } from 'components'
import Title from '../Title'
import styles from './index.scss'

const Fresh = (props) => {
    const { data, title, icon, targetClick } = props;
    let list1 = [];
    let list2 = [];
    data.map((item, index) => {
        switch (index) {
            case 0:
                list1.push(
                    <div className={styles.lBig} key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                        <LazyLoadComponent>
                            <img src={item.url} className="img-responsive" width="270" height="444"/>
                        </LazyLoadComponent>
                    </div>
                );
                break;
            case 1:
                list2.push(
                    <div className={styles.big} key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                        <LazyLoadComponent>
                            <img src={item.url} className="img-responsive" width="430" height="224"/>
                        </LazyLoadComponent>
                    </div>
                );
                break;
            case 2:
                list2.push(
                    <div className={styles.small} key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                        <div className={styles.imgDiv}>
                            <LazyLoadComponent>
                                <img src={item.url} className="img-responsive" width="210" height="210"/>
                            </LazyLoadComponent>
                        </div>
                    </div>
                );
                break;
            case 3:
                list2.push(
                    <div className={styles.small} key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                        <div className={styles.imgDiv}>
                            <LazyLoadComponent>
                                <img src={item.url} className="img-responsive" width="210" height="210"/>
                            </LazyLoadComponent>
                        </div>
                    </div>
                )
        }
    })

    return(
        <div className={styles.root}>
            {
                title !== '' ? <Title title={title} icon={icon} /> : ''
            }
            <div className={styles.panel}>
                <div className={styles.left}>
                    {list1}
                </div>
                <div className={styles.right}>
                    <div className={styles.rightWrapper}>
                        {list2}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Fresh