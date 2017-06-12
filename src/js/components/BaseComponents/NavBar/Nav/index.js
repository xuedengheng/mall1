/**
 * Created by Ben on 2016/12/10.
 */
import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './index.scss';

export default class Nav extends Component {

    render() {
        const {active, icoName, pathUrl, linkName, ...rest} = this.props;

        return (
            <Link
                {...rest}
                to={pathUrl}
                activeClassName={active}
                className={styles.root}
            >
                <i className={icoName + ' ' + styles.ico}/>
                <span className={styles.text}>{linkName}</span>
            </Link >
        )
    }
}