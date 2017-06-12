/**
 * Created by Ben on 2016/12/12.
 */
import React from 'react';
import styles from './index.scss';

const Title = (props) => {
    const { title, icon } = props;

    return (
        <div className={styles.root}>
                <span className={styles.imgSpan}>
                    <img className="img-responsive" src={icon} alt=""/>
                </span>
            <span className="font-30">{title}</span>
        </div>
    )
}
export default Title;