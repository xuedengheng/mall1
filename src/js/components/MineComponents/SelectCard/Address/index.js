/**
 * Created by yiwu on 2017/2/20.
 */
import React from 'react'
import {GoBack, FooterBox} from 'components'
import {Link} from 'react-router'
import styles from './index.scss'

const Address = ({router, addresses}) => {
  return (
    <div>
      <GoBack name="收货地址管理" router={router}/>
      <div className={styles.addressWrapper}>
        <ul>
          {
            addresses && addresses.addresses.map((item, index) =>
              <li className={styles.addressItem}
                  key={index}>
                <Link
                  className={`${styles.addressLink} ${(item.defaultFlag === 'Y') ? styles.active : ''}`}
                  to={`/mine/address/detail/${item.addressId}`}>
                  <div className={styles.leftContent}>
                    <div className={styles.header}>
                      <p className={styles.name}>{item.defaultFlag === 'Y' ? '[默认]' : ''}收货人：{item.name}</p>
                      <p className={styles.phone}>{item.mobile}</p>
                    </div>
                    <div className={`${styles.address} text-overflow-2`}>
                      收货地址：{`${item.province}${item.city}${item.block}${item.town}${item.street}${item.address}`}
                    </div>
                    {
                      item.identityId && <div className={styles.idNo}>
                        身份证号：{item.identityId.replace(/^(\w{3})\w{11}(.*)$/, '$1******$2')}
                      </div>
                    }
                  </div>
                  <div className={styles.rightContent}>
                    <i className={(item.defaultFlag === 'Y') ? 'arrow-right-white' : 'arrow-right'}/>
                  </div>
                </Link>
              </li >
            )
          }
        </ul>
      </div>
      <FooterBox name="新增地址" link="/mine/address/detail"/>
      <div className={styles.bottomB}></div>
    </div>
  )
}
export default Address