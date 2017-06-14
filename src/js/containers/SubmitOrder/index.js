/**
 * Created by Ben on 2017/3/9.
 */
import React, {Component} from 'react'
import {Toast} from 'antd-mobile'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Link, hashHistory} from 'react-router'
import styles from './index.scss'
import {api, urlApi, fetchApi, dateUtil, getQueryString, RegExp} from 'service'
import _ from 'lodash'
import {WarningModal} from 'components';
import * as AddressActions from 'actions/AddressActions'
import * as SubmitOrderActions from 'actions/SubmitOrderActions'
import {
  GoBack,
  OrderProduct,
  OrderCart,
  PromotionModal,
  AddressSelect,
  Loading,
  SetHelmet,
  CouponSelect
} from 'components'
//
// const USE = 1;
// const NOUSE = 0;

class SubmitOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      load: false,
      visible: false,
      addressVisible: false,
      couponSelectVisible: false,
      notValidVisible: false,
      skuId: null,
      productId: null,
      activityDetail: null,
      activityStatus: 1,
      selectedCoupon: null,
      price: 0,
      storeId: null,
      addresses: null,
      defaultAddress: null,
      remarks: [],
      newComerDiscount: null,
      deductionDiscount: null,
      activityId: null,
      activityType: null,
      isChecked: ''
    }
  }

  componentWillMount() {
    let {data, type} = this.props;
    if (data.length > 0 && type !== '') {
      let params = {
        url: urlApi.address.query,
        search: {account: localStorage.account, defaultFlag: 'Y'}
      }
      this.props.addressActions.queryDefault(params);
      this.promotionCtrl(data, type);
      if (this.props.type === 'product') {
        let {skuId, productId, price, activityId, activityType} = this.props.data[0].skuPrices[0];
        this.setState({
          skuId,
          productId,
          price,
          storeId: this.props.data[0].storeId,
          remarks: _.fill(Array(data.length), ''),
          activityId: activityId ? activityId : null,
          activityType: activityType ? activityType : null
        });
      } else {
        this.setState({remarks: _.fill(Array(data.length), '')});
      }
    } else {
      hashHistory.goBack()
    }
  }

  componentWillReceiveProps(nextProps) {
    const {defaultAddress, addresses, payUrl} = nextProps;
    const TdefaultAddress = this.props.address;
    const Taddresses = this.props.addresses;
    if (defaultAddress !== TdefaultAddress && defaultAddress.addresses && defaultAddress.addresses.length > 0) {
      this.setState({defaultAddress: defaultAddress.addresses[0]})
    }
    if (addresses !== Taddresses && addresses.addresses && addresses.addresses.length > 0) {
      let NAddresses = addresses.addresses;
      NAddresses.forEach(item => {
        if (item.defaultFlag === 'Y') {
          item.checked = true
        } else {
          item.checked = false
        }
      })
      this.setState({addresses: NAddresses})
    }
    if (payUrl && this.props.payUrl !== payUrl) {
      hashHistory.replace(payUrl);
      this.props.submitOrderActions.submitOrderEnd();
    }
    if (nextProps.notValid && nextProps.notValid.length > 0) {
      this.setState({notValidVisible: true})
    } else {
      this.setState({notValidVisible: false})
    }
  }

  componentWillUnmount() {
    this.props.submitOrderActions.initSubmitOrder();
  }

  // checkoutBack = (nextLoaction,state) => {
  //   const {addressVisible, couponSelectVisible} = this.state;
  //   if (addressVisible || couponSelectVisible) {
  //     // this.props.history.goForward();
  //     this.setState({addressVisible: false, couponSelectVisible: false});
  //     return false
  //   }
  // }

  getorderSkuDTOs = (data) => {
    return data.map(cart => {
      return {
        storeId: cart.storeId,
        skuPrices: cart.cartDetails.map(detail => {
          return {
            activityId: detail.activityId ? detail.activityId : null,
            activityType: detail.activityType ? detail.activityType : null,
            price: detail.price,
            quantity: detail.quantity,
            skuId: detail.skuId
          }
        })
      }
    })
  }

  promotionCtrl = (data, type) => {
    let orderSkuDTOs = [];
    switch (type) {
      case 'product':
        orderSkuDTOs = data;
        break;
      case 'cart':
        orderSkuDTOs = this.getorderSkuDTOs(data);
        break;
      default:
        break;
    }
    this.props.submitOrderActions.getPromotions(orderSkuDTOs)
  }

  watchActivity = (activityDetail) => {
    if (activityDetail.type === 'COUPON') {
      this.setState({couponSelectVisible: true})
    } else {
      this.setState({
        visible: true,
        activityDetail,
        activityStatus: _.findIndex(this.props.postPromotions, promo => {
          return promo.type === activityDetail.type
        })
      })
    }
  }

  handleClick = (type) => {
    let {queryPromotions, postPromotions} = this.props;
    let promotions = [];
    let deductPromo = queryPromotions.filter(promo => promo.type === 'DEDUCTION');
    let newComPromo = queryPromotions.filter(promo => promo.type === 'NEW_COMER');
    switch (type) {
      case 'DEDUCTION':
        if (_.findIndex(postPromotions, promo => promo.type === 'DEDUCTION') === -1) {
          if (deductPromo) promotions = [...postPromotions, ...deductPromo];
          deductPromo ? promotions = [...postPromotions, ...deductPromo] : null;
        } else {
          promotions = postPromotions.filter(promo => promo.type !== 'DEDUCTION')
        }
        break;
      case 'NEW_COMER':
        if (_.findIndex(postPromotions, promo => promo.type === 'NEW_COMER') === -1) {
          if (newComPromo) promotions = [...postPromotions, ...newComPromo];
        } else {
          promotions = postPromotions.filter(promo => promo.type !== 'NEW_COMER');
        }
        break;
      default:
        break;
    }
    this.calculate(promotions);
    this.close()
  }

  close = () => {
    this.setState({visible: false, addressVisible: false, couponSelectVisible: false})
  }

  selectAddress = () => {
    if (!this.state.addresses) {
      let params = {
        url: urlApi.address.query,
        search: {account: localStorage.account}
      };
      this.props.addressActions.queryAddress(params);
    }
    this.setState({addressVisible: true})
  }

  addressChecked = (defaultAddress) => {
    let {addresses} = this.state;
    addresses.forEach(item => {
      if (item.addressId === defaultAddress.addressId) {
        item.checked = true;
      } else {
        item.checked = false;
      }
    });
    this.setState({
      addresses,
      defaultAddress,
      addressVisible: false
    })
  }

  selectCoupon = selectedCoupon => {
    let postPromotions;
    if (_.find(this.props.postPromotions, promo => promo.type === 'COUPON')) {
      postPromotions = [
        ...this.props.postPromotions.filter(promo => promo.type !== 'COUPON'), {
          type: 'COUPON',
          coupons: [selectedCoupon]
        }]
    } else {
      postPromotions = [...this.props.postPromotions, {type: 'COUPON', coupons: [selectedCoupon]}]
    }
    this.setState({selectedCoupon, couponSelectVisible: false, isChecked: ''});
    this.calculate(postPromotions)
  }

  handleNouse = () => {
    let postPromotions;
    if (_.find(this.props.postPromotions, promo => promo.type === 'COUPON')) {
      postPromotions = [...this.props.postPromotions.filter(promo => promo.type !== 'COUPON')]
      this.calculate(postPromotions)
    }
    this.setState({selectedCoupon: null, couponSelectVisible: false, isChecked: -1});
  }

  calculate = postPromotions => {
    const submitType = this.props.type;
    let params = {
      orderSkuDTOs: submitType === 'product' ? this.props.data : this.getorderSkuDTOs(this.props.data),
      promotionDTOs: postPromotions
    }
    this.props.submitOrderActions.calculatePromotions(params)
  }

  setRemark = (index, e) => {
    const {remarks} = this.state;
    const val = e.target.value.trim();
    this.setState({
      remarks: [
        ...remarks.slice(0, index),
        val,
        ...remarks.slice(index + 1)
      ]
    })
  }

  closeNotValid = () => {
    this.props.submitOrderActions.closeModal([]);
  }

  removeNotValid = () => {
    const {data, type, notValid}=  this.props;
    this.order = data;
    this.order.map(item => {
      _.remove(item.cartDetails, (skus) => {
        return notValid.indexOf(skus.cartDetailId) > -1
      })
    })
    this.order.map(() => {
      _.remove(this.order, store => {
        return !store.cartDetails || store.cartDetails.length === 0
      })
    })
    if (this.order && this.order.length === 0) {
      hashHistory.goBack();
    } else {
      this.promotionCtrl(this.order, type);
    }
    this.props.submitOrderActions.closeModal([]);
    this.handleNouse();
  }

  submitOrder = () => {
    const {defaultAddress, skuId, price, remarks, storeId, activityId, activityType} = this.state;
    const {quantity, data, location} = this.props;
    const mode = getQueryString(location.search, 'mode') || 'submit';
    if (!defaultAddress) {
      Toast.info("请选择收货地址");
      return;
    }
    let params;
    let orderSkuDTOs;
    if (mode === 'submit') {
      orderSkuDTOs = this.getorderSkuDTOs(data);
      params = {
        url: urlApi.checkout.submit,
        search: {
          addressId: defaultAddress.addressId,
          mobilePhone: localStorage.account,
          orderInfo: this.props.data.map((cart, index) => {
            return {
              cartId: cart.cartId,
              remark: remarks[index],
              cartDetailId: cart.cartDetails.map(detail => {
                return detail.cartDetailId;
              })
            }
          }),
          promotionDTOs: this.props.postPromotions
        }
      }
    } else {
      orderSkuDTOs = data;
      params = {
        url: urlApi.checkout.immediately,
        search: {
          addressId: defaultAddress.addressId,
          mobilePhone: localStorage.account,
          skuId,
          quantity,
          price,
          storeId,
          activityId,
          activityType,
          remark: remarks[0],
          promotionDTOs: this.props.postPromotions
        }
      }
    }
    if (RegExp.isAccepted('text',remarks)) {
      this.props.submitOrderActions.submitOrder(params, orderSkuDTOs, mode)
    }else{
      Toast.info("不能输入敏感字符及表情");
    }
  }

  render() {
    const {fetchingAddress, data, notValid, type, isFetching, orderSkuDTOs, queryPromotions, promotionDiscountDTOs, postPromotions, quantity, totalAmount, totalFreight, totalPayAmount} = this.props;
    const {
      activityType,
      activityStatus,
      activityDetail,
      defaultAddress,
      addresses,
      visible,
      addressVisible,
      notValidVisible,
      remarks,
      selectedCoupon,
      couponSelectVisible,
      isChecked
    } = this.state;
    const deductPromo = _.find(promotionDiscountDTOs, promo => promo.type === 'DEDUCTION');
    const newComerPromo = _.find(promotionDiscountDTOs, promo => promo.type === 'NEW_COMER');
    const useDeduct = _.find(postPromotions, promo => promo.type === 'DEDUCTION');
    const useNewComer = _.find(postPromotions, promo => promo.type === 'NEW_COMER');
    //优惠券
    const couponPromo = _.find(queryPromotions, promo => promo.type === 'COUPON');
    const usableCoupon = couponPromo ? couponPromo.coupons.filter(coupon => coupon.available === 'Y') : [];
    const unusableCoupon = couponPromo ? couponPromo.coupons.filter(coupon => coupon.available === 'N') : [];
    return (
      <div className="box">
        <SetHelmet title="提交订单"/>
        {
          (isFetching || fetchingAddress) && <Loading />
        }
        <GoBack name="提交订单" bottom="true"/>
        <div className={styles.contentWrapper}>
          <div className={styles.overview}>
            {
              defaultAddress ?
                <div className={styles.leftWrapper} onClick={this.selectAddress}>
                  <div className='cf'>
                    <span className="font-28 color000 fl">收货人：{defaultAddress.name}</span>
                    <span className="font-28 color000 fr">{defaultAddress.mobile}</span>
                  </div>
                  <p className="font-28 color333 text-overflow-2">
                    收货地址：{`${defaultAddress.province}${defaultAddress.city}${defaultAddress.block}${defaultAddress.town}${defaultAddress.street}${defaultAddress.address}`}
                  </p>
                </div>
                :
                <Link className={styles.noaddress} to="/mine/address/detail">
                  <div className={styles.icon}>
                    <img src={require('../../../images/submit_order/sddress_icon_noaddress.png')}
                         alt=""/>
                  </div>
                  <p className={styles.desc}>您还没有收货地址，去添加</p>
                </Link>
            }
            <div className={styles.rightWrapper}>
              <span className="arrow-right"/>
            </div>
          </div>
          <div className={styles.priceWrapper}>
            <p className={`cf ${styles.itemWrapper}`}>
              <span className="fl font-26 color333">商品总计</span>
              <span className="fr font-26 color333">¥{totalAmount}</span>
            </p>
            {
              queryPromotions.map((item, index) => {
                  switch (item.type) {
                    case 'NEW_COMER':
                      return (
                        <p className={`cf ${styles.itemWrapper}`} key={index}
                           onClick={this.watchActivity.bind(this, newComerPromo)}>
                          <span className="fl font-26 color333">新人活动</span>
                          <span className={`fr arrow-right ${styles.arrow}`}/>
                          {
                            useNewComer && newComerPromo ?
                              <span
                                className="fr font-26 color333">- ¥{newComerPromo.totalDiscount}</span> :
                              <span className="fr font-26 color333">不使用优惠</span>
                          }
                        </p>
                      )
                    case 'DEDUCTION':
                      return (
                        <p className={`cf ${styles.itemWrapper}`} key={index}
                           onClick={this.watchActivity.bind(this, deductPromo)}>
                          <span className="fl font-26 color333">活动优惠</span>
                          <span className={`fr arrow-right ${styles.arrow}`}/>
                          {
                            useDeduct && deductPromo ?
                              <span
                                className="fr font-26 color333">- ¥{deductPromo.totalDiscount}</span> :
                              <span className="fr font-26 color333">不使用优惠</span>
                          }
                        </p>
                      )
                    case 'COUPON':
                      return (
                        <p className={`cf ${styles.itemWrapper}`} key={index}
                           onClick={this.watchActivity.bind(this, item)}>
                          <span className="fl font-26 color333">优惠券：{selectedCoupon ? '已选择' : '未选择'}</span>
                          <span className={`fr arrow-right ${styles.arrow}`}/>
                          <span className="fr font-26 color333">
                            { selectedCoupon ? selectedCoupon.name : `${couponPromo.coupons.length}张` }
                          </span>
                        </p>
                      )
                  }
                }
              )
            }
            <p className={`cf ${styles.itemWrapper}`}>
              <span className="fl font-26 color333">运费总计</span>
              <span className="fr font-26 color333">¥{totalFreight}</span>
            </p>
          </div>
          <div className={styles.productWrapper}>
            {
              type === 'product' ?
                <OrderProduct skus={data ? data : null} orderSkuDTOs={orderSkuDTOs} remarks={remarks}
                              setRemark={this.setRemark} activityType={activityType}/> :
                <OrderCart cart={data ? data : null} orderSkuDTOs={orderSkuDTOs} remarks={remarks}
                           setRemark={this.setRemark}/>
            }

          </div>
          <div className={styles.sign}>
            {
              (parseFloat(totalAmount) + parseFloat(totalFreight) > parseFloat(totalPayAmount) ||
              (orderSkuDTOs && _.findIndex(orderSkuDTOs, item =>
              _.findIndex(item.skuPrices, sku => parseFloat(sku.payPrice) !== parseFloat(sku.price)) > -1) > -1) ) &&
              <p>
                优惠订单暂只支持支付宝、微信、飞马等支付方式支付
              </p>
            }
            {
              orderSkuDTOs && (orderSkuDTOs.length > 1 || orderSkuDTOs[0].skuPrices.length > 1) &&
              <p>
                你的订单可能会被陆续拆成多件包裹依次送达
              </p>
            }
          </div>

        </div>
        <div className={styles.balanceWrapper}>
          <div className={styles.leftWrapper}>
            <p className="font-24 color8282" style={{lineHeight: '.5rem'}}>共{quantity}件商品</p>
            <p style={{lineHeight: '.35rem'}}><span className="font-30">实付：</span>
              <span className="font-40 color-fe5">
                                <span className="font-24">¥</span>{parseFloat(totalPayAmount).toFixed(2)}
                            </span>
            </p>
          </div>
          <div className={styles.rightWrapper} onClick={this.submitOrder}>
            <span className="font-32 color-white">立即结算</span>
          </div>
        </div>
        <PromotionModal visible={visible} activityDetail={activityDetail} activityStatus={activityStatus}
                        handleClick={this.handleClick} close={this.close}/>
        <AddressSelect visible={addressVisible} addresses={addresses ? addresses : null}
                       close={this.close} handleClick={this.addressChecked}/>
        <CouponSelect visible={couponSelectVisible} usableCoupon={usableCoupon} unusableCoupon={unusableCoupon}
                      close={this.close} handleSelect={this.selectCoupon} handleNouse={this.handleNouse}
                      isChecked={isChecked}/>
        <WarningModal visible={notValidVisible} onCancel={this.closeNotValid} onRemove={this.removeNotValid}
                      orderData={data} notValid={notValid}/>
        {/*<Prompt message={this.checkoutBack}/>*/}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  fetchingAddress: state.address.isFetching,
  defaultAddress: state.address.default,
  addresses: state.address.addresses,
  data: state.presubmit.data,
  type: state.presubmit.type,
  notValid: state.submitOrder.notValid,
  isFetching: state.submitOrder.isFetching,
  orderSkuDTOs: state.submitOrder.orderSkuDTOs,
  queryPromotions: state.submitOrder.queryPromotions,
  promotionDiscountDTOs: state.submitOrder.promotionDiscountDTOs,
  postPromotions: state.submitOrder.postPromotions,
  selectedCoupon: state.submitOrder.selectedCoupon,
  quantity: state.submitOrder.quantity,
  totalAmount: state.submitOrder.totalAmount,
  totalFreight: state.submitOrder.totalFreight,
  totalPayAmount: state.submitOrder.totalPayAmount,
  payUrl: state.submitOrder.payUrl
})

const mapDispatchToProps = dispatch => ({
  addressActions: bindActionCreators(AddressActions, dispatch),
  submitOrderActions: bindActionCreators(SubmitOrderActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitOrder)