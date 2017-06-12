/**
 * Created by Ben on 2016/12/22.
 */
import React from 'react'
import {Link} from 'react-router'
import Slider from 'react-slick'
import styles from './index.scss'
import Title from '../Title'
import {LazyLoadComponent} from 'components'

const Recommond = (props) => {
    const {data, title, icon, ...setting} = props;
    let list;
    if (data && data.length > 0) {
        list = <Slider {...setting}>
            {
                data.map((item, index) =>
                    <Link className={styles.slideItem} key={index} to={`/product/${item.productId}`}>
                        <div className={styles.imgDiv}>
                            <LazyLoadComponent>
                                <img src={item.picture} className="img-responsive"/>
                            </LazyLoadComponent>
                        </div>
                        <div className={styles.detail}>
                            <span className="text-overflow-one font-24 color333"
                                  style={{width: '100%'}}>{item.name}</span>
                            <p className="font-24 color333">￥{item.price}
                            </p>
                        </div>
                    </Link>
                )
            }
        </Slider>
    }
    return (
        <div className={styles.root}>
            {
                title !== '' ? <Title title={title} icon={icon}/> : ''
            }
            {list}
        </div>
    )
}

export default Recommond;