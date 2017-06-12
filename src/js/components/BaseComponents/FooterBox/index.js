/**
 * Created by yiwu on 2017/2/20.
 */
import React from 'react';
import {Link} from 'react-router'
import styles from './index.scss';
const FooterBox = props => {
    const {name, link, handleClick, pClass} = props;
    if (link) {
        return (
            <div className={styles.footer}>
                <Link className="block" to={link}>
                    <p>
                        {name}
                    </p>
                </Link>
            </div>
        )
    } else if (handleClick) {
        return (
            <div className={`${styles.footer} ${pClass}`} onClick={handleClick}>
                <p>
                    {name}
                </p>
            </div>
        )
    }
    return (
        <div className={styles.footer}>
            <p>
                {name}
            </p>
        </div>
    )
}
export default FooterBox