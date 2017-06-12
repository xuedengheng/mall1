/**
 * Created by Ben on 2017/1/11.
 */
import React from 'react'
import {Popup} from 'antd-mobile'
import {Link} from 'react-router'
import {Tool, buildInvitation} from 'service'
import {Contact} from 'components'
import styles from './index.scss'

const SelectCard = ({balance, couponCount, invitations}) => {
  return (
    <div className={styles.root}>
      <div className={styles.list}>
        <div className={styles.icon}>
          <img src={require('../../../../images/mine/yidian_icon.png')} alt=""/>
        </div>
        <Link className={styles.description} to="mine/coin">
          <div className={styles.title}>
            我的易点
          </div>
          <div className={styles.goDetail}>
            <span className={styles.price}>{balance}</span>
            <i className="arrow-right"/>
          </div>
        </Link>
      </div>
      {/*<div className={styles.list}>*/}
        {/*<div className={styles.icon}>*/}
          {/*<img src={require('../../../../images/mine/yiwu_card_icon.png')} alt=""/>*/}
        {/*</div>*/}
        {/*<Link className={styles.description} to="mine/card">*/}
          {/*<div className={styles.title}>*/}
            {/*我的易物卡*/}
          {/*</div>*/}
          {/*<div className={styles.goDetail}>*/}
            {/*/!*<span className={styles.price}></span>*!/*/}
            {/*<i className="arrow-right"/>*/}
          {/*</div>*/}
        {/*</Link>*/}
      {/*</div>*/}
      <div className={styles.list}>
        <div className={styles.icon}>
          <img src={require('../../../../images/mine/mine_youhuiquan.png')} alt=""/>
        </div>
        <Link className={styles.description} to="mine/coupon">
          <div className={styles.title}>
            我的优惠券
          </div>
          <div className={styles.goDetail}>
            <span className={styles.price}>{couponCount}</span>
            <i className="arrow-right"/>
          </div>
        </Link>
      </div>

      {/*{*/}
        {/*((Tool.isWeiXin() || Tool.isQQ() || Tool.isWeibo()) || invitations.length > 0 ) ?*/}
          {/*<div className={styles.list}>*/}
            {/*<div className={styles.icon}>*/}
              {/*<img src={require('../../../../images/mine/wo_yaoqing_icon.png')} alt=""/>*/}
            {/*</div>*/}
            {/*<a className={styles.description} href={buildInvitation(invitations[0].shareLink)}>*/}
              {/*<div className={styles.title}>*/}
                {/*邀请好友*/}
              {/*</div>*/}
              {/*<div className={styles.goDetail}>*/}
                {/*<span className={styles.price}>立即邀请</span>*/}
                {/*<i className="arrow-right"/>*/}
              {/*</div>*/}
            {/*</a>*/}
          {/*</div>*/}
          {/*:*/}
          {/*null*/}
      {/*}*/}

      {/*<div className={styles.list}>*/}
      {/*<div className={styles.icon}>*/}
      {/*<img src={require('../../../../images/mine/mine_icon_message.png')} alt=""/>*/}
      {/*</div>*/}
      {/*<div className={styles.description}>*/}
      {/*<div className={styles.title}>*/}
      {/*消息通知*/}
      {/*</div>*/}
      {/*<div className={styles.goDetail}>*/}
      {/*<span className={styles.message}>10</span>*/}
      {/*<i className="arrow-right" />*/}
      {/*</div>*/}
      {/*</div>*/}
      {/*</div>*/}
      {/*<div className={styles.list}>*/}
      {/*<div className={styles.icon}>*/}
      {/*<img src={require('../../../../images/mine/mine_icon_collect.png')} alt=""/>*/}
      {/*</div>*/}
      {/*<div className={styles.description}>*/}
      {/*<div className={styles.title}>*/}
      {/*我的收藏*/}
      {/*</div>*/}
      {/*<div className={styles.goDetail}>*/}
      {/*<i className="arrow-right" />*/}
      {/*</div>*/}
      {/*</div>*/}
      {/*</div>*/}
      {/*<div className={styles.list}>*/}
      {/*<div className={styles.icon}>*/}
      {/*<img src={require('../../../../images/mine/mine_icon_see.png')} alt=""/>*/}
      {/*</div>*/}
      {/*<div className={styles.description}>*/}
      {/*<div className={styles.title}>*/}
      {/*我看过的*/}
      {/*</div>*/}
      {/*<div className={styles.goDetail}>*/}
      {/*<i className="arrow-right" />*/}
      {/*</div>*/}
      {/*</div>*/}
      {/*</div>*/}
      <div className={styles.list}>
        <div className={styles.icon}>
          <img src={require('../../../../images/mine/mine_icon_address.png')} alt=""/>
        </div>
        <Link className={styles.description} to="mine/address">
          <div className={styles.title}>
            地址管理
          </div>
          <div className={styles.goDetail}>
            <i className="arrow-right"/>
          </div>
        </Link>
      </div>
      {/*<SplitLine />*/}
      {/*<div className={styles.list}>*/}
      {/*<div className={styles.icon}>*/}
      {/*<img src={require('../../../../images/mine/mine_icon_feedback.png')} alt=""/>*/}
      {/*</div>*/}
      {/*<div className={styles.description}>*/}
      {/*<div className={styles.title}>*/}
      {/*意见反馈*/}
      {/*</div>*/}
      {/*<div className={styles.goDetail}>*/}
      {/*<i className="arrow-right" />*/}
      {/*</div>*/}
      {/*</div>*/}
      {/*</div>*/}
      <div className={styles.list}>
        <div className={styles.icon}>
          <img src={require('../../../../images/mine/mine_icon_service.png')} alt=""/>
        </div>
        <div className={styles.description} onClick={contact}>
          <div className={styles.title}>
            联系客服
          </div>
          <div className={styles.goDetail}>
            <i className="arrow-right"/>
          </div>
        </div>
      </div>
    </div>
  )
}

const contact = () => {
  Popup.show(
    <Contact />,
    {
      animationType: 'slide-up',
      maskClosable: true
    }
  )
}

export default SelectCard