/**
 * Created by Ben on 2016/12/13.
 */
import React, {Component} from 'react'
import {Popup} from 'antd-mobile'
import {Link} from 'react-router'
import {Contact} from 'components'
import styles from './index.scss'

const ADDCART = 0;
const BUY = 1;

export default class BottomButton extends Component {
  contact = () => {
    Popup.show(
      <Contact />,
      {
        animationType: 'slide-up',
        maskClosable: true
      }
    )
  }

  render() {
    const {openModal, isValid, stockEmptyText} = this.props;

    return (
      <div>
        <div className={styles.gHeight} />
        <div className={styles.root}>
          {
            isValid ?
              <div className={styles.havegoods}>
                <div className={styles.left}>
                  <div className={styles.leftNav}>
                    <Link to="/home" className="block">
                      <i className={styles.icon + ' ' + styles.home}/>
                      <span>首页</span>
                    </Link>
                  </div>
                  <div className={styles.leftNav} onClick={this.contact}>
                    <i className={styles.icon + ' ' + styles.custom}/>
                    <span>客服</span>
                  </div>
                </div>
                <div className={styles.addCart} onClick={() => {
                  openModal(ADDCART)
                }}>
                  <span>加入购物车</span>
                </div>
                <div className={styles.buyNow} onClick={() => {
                  openModal(BUY)
                }}>
                  <span>立即购买</span>
                </div>
              </div>
              :
              <div>
                <div className={styles.warning}>
                  {stockEmptyText}
                </div>
                <div className={styles.nogoods}>
                  <div className={styles.left}>
                    <div className={styles.leftNav}>
                      <Link to="/home" className="block">
                        <i className={styles.icon + ' ' + styles.home}/>
                        <span>首页</span>
                      </Link>
                    </div>
                    <div className={styles.leftNav} onClick={this.contact}>
                      <i className={styles.icon + ' ' + styles.custom}/>
                      <span>客服</span>
                    </div>
                  </div>
                  <div className={styles.noinventory}>
                    <span>抱歉，暂无库存</span>
                  </div>
                </div>
              </div>
          }
        </div>
        {/*<div style={{height: '.9rem'}}/>*/}
        {/*<a style={{*/}
          {/*position: 'fixed',*/}
          {/*display: 'block',*/}
          {/*width: '100%',*/}
          {/*height: '.9rem',*/}
          {/*bottom: '0',*/}
          {/*left: '0',*/}
          {/*lineHeight: '.9rem',*/}
          {/*textAlign: 'center',*/}
          {/*background: '#fe5400',*/}
          {/*color: '#fff',*/}
          {/*fontSize: '.3rem'*/}
        {/*}}*/}
           {/*href={`http://a.mlinks.cc/AaDb?target=product_detail&title=Title&identity=${this.props.productId}`}>*/}
          {/*立即购买*/}
        {/*</a>*/}
      </div>
    )
  }
}