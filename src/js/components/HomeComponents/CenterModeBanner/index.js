/**
 * Created by Ben on 2016/12/12.
 */
import React, {Component} from 'react';
import Slider from 'react-slick';
import {LazyLoadComponent} from 'components'
import styles from './index.scss';
import Title from '../Title'

export default class CenterModeBanner extends Component {
    render() {
        const {data, title, icon, targetClick, ...setting} = this.props;
        let list =
            <Slider {...setting}>
                {
                    data.map((item, index) =>
                        <h3 key={index} onClick={targetClick.bind(this, item.target, item.id)}>
                            <div  className={styles.wrapper}>
                                <div className={styles.imgDiv}>
                                    <LazyLoadComponent>
                                        <img className={`img-responsive ${styles.slideImg}`} src={item.url} alt=""/>
                                    </LazyLoadComponent>
                                </div>
                            </div>
                        </h3>
                    )
                }
            </Slider>;
        return (
            <div className={styles.root}>
                {
                    title !== '' ? <Title title={title} icon={icon}/> : ''
                }
                {list}
            </div>
        )
    }
}