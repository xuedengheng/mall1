/**
 * Created by Ben on 2017/1/10.
 */
import React from 'react'
import {Link} from 'react-router'
import {LazyLoadComponent} from 'components'
import styles from './index.scss'
import {dateUtil} from 'service'

const Article = ({data, detail}) => {
    let articles = [];
    if (!detail) {
        data.map((item, index) => {
            articles.push(
                <Link className={styles.panel} key={index} to={`/life/${item.id}`}>
                    <div className={styles.picture}>
                        <LazyLoadComponent>
                            <img src={item.picture} alt="" className="img-responsive"/>
                        </LazyLoadComponent>
                    </div>
                    <div className={styles.detail}>
                        <p>
                            <span className={styles.attr}>{item.catalog.name}</span>
                            <span className="color8282 font-24">{dateUtil.turnToZH(item.publishDate)}</span>
                        </p>
                        <p className="font-32 color333 text-overflow-one">
                            {item.title}
                        </p>
                        <p className="font-26 color8282 text-overflow-2 pt10">
                            {item.digest}
                        </p>
                    </div>
                </Link>
            )
        })
    } else {
        data.map((item, index) => {
            articles.push(
                <div className={styles.panel} key={index}>
                    <div className={styles.picture}>
                        <LazyLoadComponent>
                            <img src={item.picture} alt="" className="img-responsive"/>
                        </LazyLoadComponent>
                    </div>
                    <div className={styles.detail}>
                        <p>
                            <span className={styles.attr}>{item.catalog.name}</span>
                            <span className="color8282 font-24">{dateUtil.turnToZH(item.publishDate)}</span>
                        </p>
                        <p className="font-32 color333 text-overflow-2">
                            {item.title}
                        </p>
                    </div>
                    <div className={styles.article} dangerouslySetInnerHTML={{__html: item.content}}></div>
                </div>
            )
        })
    }


    return (
        <div className={styles.root}>
            {articles}
        </div>
    )

}

export default Article;