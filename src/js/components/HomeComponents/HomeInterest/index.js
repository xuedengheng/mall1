/**
 * Created by Ben on 2016/12/23.
 */
import React from 'react'
import {Link} from 'react-router'
import Title from '../Title'
import styles from './index.scss'
import {LazyLoadComponent} from 'components'

const HomeInterest = (props) => {
  const {data, title, icon, openModal} = props;
  let list = [];
  if (data && data.length > 0) {
    data.map((item, index) => {
      list.push(
        <div key={index} className={styles.listPanel}>
          <Link className={styles.list} to={`/product/${item.productId}`}>
            <div className={styles.thumb}>
              <LazyLoadComponent>
                <img src={item.picture} className="img-responsive"/>
              </LazyLoadComponent>
            </div>
            <div className={styles.detail}>
              <p className="text-overflow-2 font-28 color000">{item.name}</p>
              <div className={`space-between ${styles.price}`}>
                <div>
                  <p className="font-32 color000">
                    ￥{item.price}
                    {
                      item.price !== item.originPrice ?
                        <s className="font-24" style={{color: '#ababab', paddingLeft: '.08rem'}}>{item.originPrice}</s>
                        : null
                    }
                  </p>
                  <p className="font-20 color8282">{item.sellCount}人已选</p>
                </div>

              </div>
            </div>
          </Link>
          <div className={styles.cart} onClick={openModal.bind(this, item.productId)}>
            <img src={require('../../../../images/base/search_icon_addcar.png')} className="img-responsive"/>
          </div>
        </div>
      )
    });
  }

  return (
    <div className={styles.root}>
      {
        title !== '' ? <Title title={title} icon={icon}/> : ''
      }
      <div className={styles.panel}>
        {list}
      </div>
    </div>
  )
}

export default HomeInterest;