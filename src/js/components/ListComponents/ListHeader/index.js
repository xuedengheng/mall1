/**
 * Created by Ben on 2017/1/5.
 */
import React from 'react'
import styles from './index.scss'
import {Link} from 'react-router'

const ListHeader = props => {
  const {back, value} = props
  return (
    <div className={styles.root}>
      <div className={styles.back} onClick={back}>
        <img src={require('../../../../images/base/search_icon_back.png')} className="img-responsive"/>
      </div>
      <Link className={styles.searchInput} to="/search">
        <span className="ver-center">
          <img src={require("../../../../images/base/search_icon_searchhistory.png")} alt=""/>
        </span>
        {value ?
          <p className={`ver-center ${styles.font}`}>{value}</p> :
          <p className={`ver-center ${styles.font}  ${styles.noinput}`}>商品名 品牌 分类</p>
        }
      </Link>
      <Link className={styles.cart} to="/cart/1">
        <img src={require("../../../../images/base/search_icon_car.png")} className="img-responsive"/>
      </Link>
    </div>
  )

}
export default ListHeader