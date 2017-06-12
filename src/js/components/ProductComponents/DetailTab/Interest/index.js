/**
 * Created by Ben on 2016/12/20.
 */
import React, {Component} from 'react';
import {Link} from 'react-router';
import styles from './index.scss';
import {LazyLoadComponent} from 'components'

const Interest = ({data, openModal}) => {
  let list = data && data.length > 0 ?
    data.map((item, index) => {
        return (
          <li className={styles.customLi} key={index}>
            <Link className="block" to={`/product/${item.productId}`}>
              <div className={styles.imgPanel}>
                <LazyLoadComponent>
                  <img src={item.picture} className="img-responsive"/>
                </LazyLoadComponent>
              </div>
              <div className={styles.detail}>
                <p className="font-28 color333 text-overflow-2" style={{height: '.9rem'}}>
                  {item.name}
                </p>
                <div className={`space-between ${styles.control}`}>
                  <div className={styles.left}>
                    <p className="font-30 color333">
                      ¥{item.price && parseFloat(item.price).toFixed(2)}
                    </p>
                    <p className="font-20 color8282">
                      {item.sellCount}人已选
                    </p>
                  </div>

                </div>
              </div>
            </Link>
            <div className={styles.right} onClick={openModal.bind(this, item.productId)}>
              <img src={require('../../../../../images/base/search_icon_addcar.png')}
                   className="img-responsive"/>
            </div>
          </li>
        )
      }
    ) : null
  return (
    <ul className={styles.customUl}>
      {list}
    </ul>
  )
}

export default Interest;
