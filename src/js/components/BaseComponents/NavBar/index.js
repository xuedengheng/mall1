/**
 * Created by Ben on 2016/12/10.
 */
import React, { Component } from 'react';
import Nav from './Nav';
import styles from './index.scss';

export default class NavBar extends Component {
    render() {
        return (
            <div>
                <div style={{height: '1.1rem'}}></div>
                <div className={styles.root}>
                    <Nav
                        pathUrl="/home"
                        icoName="home"
                        active={styles.home}
                        linkName="首页"
                    />
                    <Nav
                        pathUrl="/life"
                        icoName="life"
                        active={styles.life}
                        linkName="生活"
                    />
                    <Nav
                        pathUrl="/cart/1"
                        icoName="cart"
                        active={styles.cart}
                        linkName="购物车"
                    />
                    <Nav
                        pathUrl="/mine"
                        icoName="mine"
                        active={styles.mine}
                        linkName="我的"
                    />
                </div>
            </div>
        )
    }
}