/**
 * Created by Ben on 2017/1/12.
 */
import React from 'react'
import styles from './index.scss'

const CartPay = ({bottom, mode, submit, del, checkDetailIds, allDetailIds, totalFee, handleAllOps}) => {

  return (
    <div className={styles.root}>
      <div className={styles.fHeight}/>
      <div className={`fixed-bottom space-between ${styles.content}`} style={{bottom: bottom + 'rem'}}>
        <div className={`ver-center ${styles.checkAll}`} onClick={handleAllOps.bind(this)}>
          <div className={`center-center ${styles.checkBox}`}>
            {
              allDetailIds.length > 0 && (allDetailIds.length === checkDetailIds.length) ?
                <img src={require('../../../../images/cart/car_icon_check_yes.png')} alt=""/> :
                <img src={require('../../../../images/cart/car_icon_check_no.png')} alt=""/>
            }
          </div>
          <span className="font-32 color333">全选</span>
        </div>
        <div className={styles.ctrl}>
          {
            mode === 'submit' &&
            <div className={`${styles.allPrice}`}>
              {
                allDetailIds.length > 0 &&
                <p className="font-40 color-fe5">¥{totalFee.toFixed(2)}</p>
              }
              {
                checkDetailIds.length > 0 &&
                <p className="font-24 color8282">不包含运费</p>
              }
            </div>
          }
          {
            mode === 'submit' ?
              <div
                className={`center-center ${styles.pay} ${checkDetailIds.length === 0 ? styles.disable : ''}`}
                onClick={submit.bind(this)}>
                <span className="font-32 color-white">去结算</span>
              </div> :
              <div
                className={`center-center ${styles.pay} ${checkDetailIds.length === 0 ? styles.disable : ''}`}
                onClick={del.bind(this)}>
                <span className="font-32 color-white">删除</span>
              </div>
          }


        </div>
      </div>
    </div>
  )
}

export default CartPay;