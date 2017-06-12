/**
 * Created by Ben on 2016/12/9.
 */
import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './index.scss';

export default class SearchHeader extends Component {
    constructor(props) {
        super(props);
    }

    render () {
        return (
            <div className={styles.root}>
                <Link
                    to="/search"
                    className={`hor ${styles.searchBar}`}>
                    <span className="ver-center">
                        <img src={require("../../../../images/home/homepage_searchbar_icon_search.png")} alt=""/>
                    </span>
                    <p className="ver-center">商品名 品牌 分类</p>
                </Link>
                <Link className={styles.categoryIcon} to="/catelog">
                    <img src={require("../../../../images/home/homepage_icon_search.png")} alt=""/>
                </Link>
            </div>
        )
    }
}