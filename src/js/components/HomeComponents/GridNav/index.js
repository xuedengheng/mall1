import React from 'react'
import { Link } from 'react-router'
import { LazyLoadComponent } from 'components'
import styles from './index.scss'

const GridNav = (props) => {
    const { data } = props
    let grid = [];
    data.map((item, index) => {
        if (item.target.indexOf('http') > -1) {
            grid.push(
                <a
                    key={index}
                    href={item.target}
                    className={`center-center-column ${styles.root}`}>
                    <LazyLoadComponent>
                        <img src={item.url} className={styles.thumb} alt=""/>
                    </LazyLoadComponent>
                    <span className={styles.title}>
                        {item.title}
                    </span>
                </a>
            )
        } else {
            grid.push(
                <Link
                    key={index}
                    to={item.target}
                    className={`center-center-column ${styles.root}`}>
                    <LazyLoadComponent>
                        <img src={item.url} className={styles.thumb} alt=""/>
                    </LazyLoadComponent>
                    <span className={styles.title}>
                        {item.title}
                    </span>
                </Link>
            )
        }
    })

    return (
        <div>
            {grid}
        </div>
    )
}
export default GridNav;
