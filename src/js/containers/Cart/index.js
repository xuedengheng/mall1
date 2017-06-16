/**
 * Created by Ben on 2016/12/11.
 */
import React, {Component} from 'react'
import {Link, hashHistory} from 'react-router'
import _ from 'lodash'
import {Toast} from 'antd-mobile'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as CartActions from 'actions/CartActions'
import * as PresubmitActions from 'actions/PresubmitActions'
import {api, urlApi, fetchApi, Constant} from 'service'
import styles from './index.scss'
import {
  NavBar,
  GoBack,
  CartInfo,
  CartPay,
  Loading,
  SetHelmet
} from 'components'

class Cart extends Component {

  constructor(props) {
    super(props);
    this.state = {
      mode: 'submit',
      allEditDetailIds: [],
      allSubmitDetailIds: [],
      checkDetailIds: [],
      delInfo: [],
      cacheCarts: []
    }
  }

  componentWillMount() {
    this.props.cartActions.queryCart()
  }

  componentWillReceiveProps(nextProps) {
    const {list, cancelCheck} = nextProps;
    const {mode} = this.state;
    const allEditDetailIds = this.getAllEditCartDetailIds(list)
    const allSubmitDetailIds = this.getAllSubmitCartDetailIds(list)
    this.setState({allEditDetailIds, allSubmitDetailIds, cacheCarts: list})
    if (mode === 'edit' && allEditDetailIds.length === 0) {
      this.setState({mode: 'submit', checkDetailIds: []})
    }
    if (cancelCheck) {
      this.setState({checkDetailIds: [], delInfo: []});
      this.props.cartActions.initCancelCheck()
    }
    if(this.props.list !== list) {
      this.setState({checkDetailIds: []});
    }
  }

  getAllEditCartDetailIds(carts) {
    const ids = []
    carts.forEach((cart) => {
      cart.cartDetails.forEach((detail) => {
        ids.push(detail.cartDetailId)
      })
    })
    return ids;
  }

  getAllSubmitCartDetailIds(carts) {
    const ids = []
    carts.forEach((cart) => {
      cart.cartDetails.forEach((detail) => {
        if (detail.valid) ids.push(detail.cartDetailId)
      })
    })
    return ids;
  }

  changeMode = (type, e) => {
    e.preventDefault()
    this.setState({mode: type, checkDetailIds: [], delInfo: []})
  }

  handleAllOps = (e) => {
    e.preventDefault()
    const {mode, allEditDetailIds, allSubmitDetailIds, checkDetailIds} = this.state
    const {list} = this.props
    const allDetailIds = mode === 'edit' ? allEditDetailIds : allSubmitDetailIds
    if (allDetailIds.length === checkDetailIds.length) {
      this.setState({checkDetailIds: []})
      if (mode === 'edit') {
        this.setState({delInfo: []})
      }
    } else {
      this.setState({checkDetailIds: allDetailIds})
      if (mode === 'edit') {
        const delInfo = list.map((cart) => {
          const cartDatilIds = cart.cartDetails.map((detail) => {
            return detail.cartDetailId
          })
          return {cartId: cart.cartId, cartDetailId: cartDatilIds}
        })
        this.setState({delInfo})
      }
    }
  }

  selectDetail = (detail, e) => {
    e.preventDefault()
    const {mode, checkDetailIds} = this.state
    if (this.checkDetailSelected(detail)) {
      this.setState({checkDetailIds: checkDetailIds.filter(id => id !== detail.cartDetailId)})
      if (mode === 'edit') {
        this.setState({delInfo: this.deleteDetailInfo(detail)})
      }
    } else {
      if (mode === 'edit' || (mode === 'submit' && detail.valid)) {
        this.setState({checkDetailIds: _.union(checkDetailIds, [detail.cartDetailId])})
      }
      if (mode === 'edit') {
        this.setState({delInfo: this.createDetailInfo(detail)})
      }
    }
  }

  createDetailInfo = (detail) => {
    const {delInfo} = this.state
    const cartIndex = _.findIndex(delInfo, (cart) => {
      return cart.cartId === detail.cartId
    })
    if (cartIndex < 0) {
      return delInfo.concat({cartId: detail.cartId, cartDetailId: [detail.cartDetailId]})
    } else {
      const cartDatilIds = delInfo[cartIndex].cartDetailId
      return [
        ...delInfo.slice(0, cartIndex),
        {cartId: detail.cartId, cartDetailId: cartDatilIds.concat([detail.cartDetailId])},
        ...delInfo.slice(cartIndex + 1)
      ]
    }
  }

  deleteDetailInfo = (detail) => {
    const {delInfo} = this.state
    const cartIndex = _.findIndex(delInfo, (cart) => {
      return cart.cartId === detail.cartId
    })
    if (cartIndex < 0) return delInfo
    const cartDatilIds = delInfo[cartIndex].cartDetailId
    const newCartDetailIds = _.difference(cartDatilIds, [detail.cartDetailId])
    return newCartDetailIds.length > 0 ? [
      ...delInfo.slice(0, cartIndex),
      {cartId: detail.cartId, cartDetailId: _.difference(cartDatilIds, [detail.cartDetailId])},
      ...delInfo.slice(cartIndex + 1)
    ] : [
      ...delInfo.slice(0, cartIndex),
      ...delInfo.slice(cartIndex + 1)
    ]
  }

  checkDetailSelected = (detail) => {
    const {checkDetailIds} = this.state
    return checkDetailIds.indexOf(detail.cartDetailId) > -1
  }

  selectCart = (cart, e) => {
    e.preventDefault();
    const {mode, checkDetailIds} = this.state
    const cartDetailIds = mode === 'edit' ? cart.cartDetails.map(detail => detail.cartDetailId) : cart.cartDetails.filter(detail => detail.valid).map(detail => detail.cartDetailId);
    if (this.checkCartSelected(cart)) {
      this.setState({checkDetailIds: _.difference(checkDetailIds, cartDetailIds)})
      if (mode === 'edit') {
        this.setState({delInfo: this.deleteCartInfo(cart)})
      }
    } else {
      this.setState({checkDetailIds: _.union(checkDetailIds, cartDetailIds)})
      if (mode === 'edit') {
        this.setState({delInfo: this.createCartInfo(cart)})
      }
    }
  }

  createCartInfo = (selectedCart) => {
    const {delInfo} = this.state
    const cartIndex = _.findIndex(delInfo, (cart) => {
      return cart.cartId === selectedCart.cartId
    })
    const cartDatilIds = selectedCart.cartDetails.map((detail) => {
      return detail.cartDetailId
    })
    if (cartIndex < 0) {
      return delInfo.concat({cartId: selectedCart.cartId, cartDetailId: cartDatilIds})
    } else {
      return [
        ...delInfo.slice(0, cartIndex),
        {cartId: selectedCart.cartId, cartDetailId: cartDatilIds},
        ...delInfo.slice(cartIndex + 1)
      ]
    }
  }

  deleteCartInfo = (selectedCart) => {
    const {delInfo} = this.state
    const cartIndex = _.findIndex(delInfo, (cart) => {
      return cart.cartId === selectedCart.cartId
    })
    if (cartIndex < 0) return delInfo
    return [
      ...delInfo.slice(0, cartIndex),
      ...delInfo.slice(cartIndex + 1)
    ]
  }

  checkCartSelected = (cart) => {
    const {checkDetailIds} = this.state;
    const cartDetailIds = cart.cartDetails.map(detail => detail.cartDetailId)
    for (let i = 0, len = cartDetailIds.length; i < len; i++) {
      if (checkDetailIds.indexOf(cartDetailIds[i]) < 0) return false
    }
    return true
  }

  setCount = (type, detail, e) => {
    e.preventDefault()
    if (type === 'subtract' && Number(detail.quantity) <= 1) return false
    if (type === 'plus' && Number(detail.quantity) === Number(detail.stock)) return false
    const quantity = type === 'plus' ? Number(detail.quantity) + 1 : Number(detail.quantity) - 1
    this.props.cartActions.updateCart({cartDetailId: detail.cartDetailId, quantity});
  }

  delCartDetails = (e) => {
    e.preventDefault()
    const {delInfo, checkDetailIds} = this.state;
    if (checkDetailIds.length === 0) return false;
    const cartDetailIds = delInfo.reduce((acc, cart) => {
      return acc.concat(cart.cartDetailId)
    }, []);
    this.props.cartActions.removeCart({cartDetailIds: cartDetailIds.join(',')})
  }

  createPreOrderCarts = (checkDetailIds) => {
    const {cacheCarts} = this.state
    let newCacheCarts = cacheCarts.slice()
    for (let i = 0, len = newCacheCarts.length; i < len; i++) {
      newCacheCarts[i].cartDetails = newCacheCarts[i].cartDetails.filter((detail) => {
        return checkDetailIds.indexOf(detail.cartDetailId) > -1
      })
    }
    return newCacheCarts.filter((cart) => {
      return cart.cartDetails.length > 0
    })
  }

  submitOrder = (e) => {
    e.preventDefault();
    const {checkDetailIds} = this.state;
    if (checkDetailIds.length === 0) return false;
    const preOrderCarts = this.createPreOrderCarts(checkDetailIds);
    this.props.cartActions.checkoutOrder({cartDetailIds: checkDetailIds.join(',')}, preOrderCarts)
  }

  renderSubmitModeList() {
    const {list} = this.props;
    if (list.length > 0) {
      return list.map((cart) => {
        return (
          <div className={styles.cartWrapper} key={cart.storeId}>
            <div className={`ver-center ${styles.header}`}>
              <div className={`center-center ${styles.checkPanel}`}
                   onClick={this.selectCart.bind(this, cart)}>
                {
                  this.checkCartSelected(cart) ?
                    <img src={require('../../../images/cart/car_icon_check_yes.png')} alt=""/>
                    :
                    <img src={require('../../../images/cart/car_icon_check_no.png')} alt=""/>
                }
              </div>
              <div className={`ver-center ${styles.title}`}>
                <span className="font-28 color333">{cart.storeName}发货</span>
              </div>
            </div>
            {
              cart.cartDetails.map((detail) => {
                return (
                  <div className={styles.detailWrapper} key={detail.cartDetailId}>
                    <div className={`center-center ${styles.checkPanel}`}
                         onClick={this.selectDetail.bind(this, detail)}>
                      {
                        this.checkDetailSelected(detail) ?
                          <img
                            src={require('../../../images/cart/car_icon_check_yes.png')}
                            alt=""/>
                          :
                          <img
                            src={require('../../../images/cart/car_icon_check_no.png')}
                            alt=""/>
                      }
                    </div>
                    <Link className={`block ver-center ${styles.detail}`}
                          to={`/product/${detail.productId}`}>
                      <div className={styles.thumb}>
                        <img src={detail.picture} alt="" className="img-responsive"/>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.title}>
                          <p
                            className={`text-overflow-1 font-24 ${!detail.valid ? 'color8282' : 'color333'}`}>{detail.activityType ?
                            <span
                              className="color-fe5">{Constant.getActivityName(detail.activityType)}</span> : null}{detail.productName}</p>
                          <p className="text-overflow-1 font-20 color8282">规格：{detail.productAttr}</p>
                        </div>
                        <div className={`space-between ${styles.price}`}>
                          <p className={`font-32 ${!detail.valid ? 'color8282' : 'color-fe5'}`}>
                            ¥{detail.price}
                          </p>

                        </div>
                      </div>
                    </Link>
                    {
                      detail.valid ? <div className={styles.numCtrl}>
                        <div className={`center-center ${styles.des}`}
                             onClick={this.setCount.bind(this, 'subtract', detail)}>
                          {
                            Number(detail.quantity) <= 1 ?
                              <img
                                src={require('../../../images/cart/car_count_icon_minus_lowlighted.png')}
                                alt=""/> :
                              <img
                                src={require('../../../images/cart/car_count_icon_minus_highlighted.png')}
                                alt=""/>
                          }
                        </div>
                        <div className={`center-center ${styles.num}`}>
                          <span>{detail.quantity}</span>
                        </div>
                        <div className={`center-center ${styles.add}`}
                             onClick={this.setCount.bind(this, 'plus', detail)}>
                          {
                            Number(detail.quantity) >= Number(detail.stock) ?
                              <img
                                src={require('../../../images/cart/car_count_icon_add_lowlighted.png')}
                                alt=""/> :
                              <img
                                src={require('../../../images/cart/car_count_icon_add_highlighted.png')}
                                alt=""/>
                          }

                        </div>
                      </div>
                        :
                        <p className={`font-24 color-fe5 ${styles.invalid}`}>{detail.reason}</p>
                    }
                  </div>
                )
              })
            }
          </div>
        )
      })
    }
    return (
      <div className="empty-box">
        <div className="pic">
          <img src={require('../../../images/cart/car_icon_nogoods.png')} alt=""/>
        </div>
        <p className="text">购物车还空着呢，快去挑选商品吧</p>
      </div>
    )
  }

  renderEditModeList() {
    const {list} = this.props;
    if (list.length > 0) {
      return list.map((cart) => {
        return (
          <div className={styles.cartWrapper} key={cart.storeId}>
            <div className={`ver-center ${styles.header}`}>
              <div className={`center-center ${styles.checkPanel}`}
                   onClick={this.selectCart.bind(this, cart)}>
                {
                  this.checkCartSelected(cart) ?
                    <img src={require('../../../images/cart/car_icon_check_yes.png')} alt=""/>
                    :
                    <img src={require('../../../images/cart/car_icon_check_no.png')} alt=""/>
                }
              </div>
              <div className={`ver-center ${styles.title}`}>
                <span className="font-28 color333">{cart.storeName}发货</span>
              </div>
            </div>
            {
              cart.cartDetails.map((detail) => {
                return (
                  <div className={styles.detailWrapper} key={detail.cartDetailId}>
                    <div className={`center-center ${styles.checkPanel}`}
                         onClick={this.selectDetail.bind(this, detail)}>
                      {
                        this.checkDetailSelected(detail) ?
                          <img
                            src={require('../../../images/cart/car_icon_check_yes.png')}
                            alt=""/>
                          :
                          <img
                            src={require('../../../images/cart/car_icon_check_no.png')}
                            alt=""/>
                      }
                    </div>
                    <Link className={`block ver-center ${styles.detail}`}
                          to={`/product/${detail.productId}`}>
                      <div className={styles.thumb}>
                        <img src={detail.picture} alt="" className="img-responsive"/>
                      </div>
                      <div className={styles.info}>
                        <div className={styles.title}>
                          <p
                            className={`text-overflow-1 font-24 ${!detail.valid ? 'color8282' : 'color333'}`}>{detail.activityType ?
                            <span
                              className="color-fe5">{Constant.getActivityName(detail.activityType)}</span> : null}{detail.productName}</p>
                          <p className="font-20 color8282">规格：{detail.productAttr}</p>
                        </div>
                        <div className={`space-between ${styles.price}`}>
                          <p className={`font-32 ${!detail.valid ? 'color8282' : 'color-fe5'}`}>
                            ¥{detail.price}
                          </p>
                        </div>
                      </div>
                    </Link>
                    {
                      !detail.valid &&
                        <p className={`font-24 color-fe5 ${styles.invalid}`}>{detail.reason}</p>
                    }
                  </div>
                )
              })
            }
          </div>
        )
      })
    }
    return (
      <div className="empty-box">
        <div className="pic">
          <img src={require('../../../images/cart/car_icon_nogoods.png')} alt=""/>
        </div>
        <p className="text">购物车还空着呢，快去挑选商品吧</p>
      </div>
    )
  }

  render() {
    const {isFetching, list, params} = this.props;
    const {mode, checkDetailIds, allEditDetailIds, allSubmitDetailIds} = this.state
    const allDetailIds = mode === 'edit' ? allEditDetailIds : allSubmitDetailIds
    const totalFee = list.reduce((acc, cart) => {
      return acc + cart.cartDetails.reduce((detailAcc, detail) => {
          const fee = checkDetailIds.indexOf(detail.cartDetailId) < 0 ? 0 : Number(detail.price) * Number(detail.quantity)
          return detailAcc + fee
        }, 0)
    }, 0)
    return (
      <div>
        <SetHelmet title="购物车"/>
        {
          isFetching && <Loading />
        }
        <div className={`fixed-top ver-center ${styles.content} border-bottom`}>
          {
            params.type !== '1' && <div className={`center-center ${styles.back}`} onClick={() => {
              hashHistory.goBack()
            }}>
              <img src={require('../../../images/base/search_icon_back.png')} alt=""/>
            </div>
          }
          <p className="text-center font-32 text-overflow-1">
            购物车
          </p>
          {
            mode === 'submit' ?
              <div className={`center-center ${styles.order}`}
                   onClick={this.changeMode.bind(this, 'edit')}>
                                <span className="font-32">
                                    编辑
                                </span>
              </div> :
              <div className={`center-center ${styles.order}`}
                   onClick={this.changeMode.bind(this, 'submit')}>
                                <span className="font-32">
                                    完成
                                </span>
              </div>
          }
        </div>
        <div className={`${styles.container} ${params.type !== '1' ? styles.bottom1 : ''}`}>
          {mode === 'submit' ? this.renderSubmitModeList() : this.renderEditModeList()}
        </div>
        <CartPay bottom={params.type === '1' ? 1.1 : 0} mode={mode} handleAllOps={this.handleAllOps}
                 submit={this.submitOrder} del={this.delCartDetails} checkDetailIds={checkDetailIds}
                 allDetailIds={allDetailIds} totalFee={totalFee}/>
        {
          params.type === '1' ? <NavBar /> : ''
        }
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.cart.isFetching,
  list: state.cart.list,
  cancelCheck: state.cart.cancelCheck
})

const mapDispatchToProps = dispatch => ({
  cartActions: bindActionCreators(CartActions, dispatch),
  presubmitActions: bindActionCreators(PresubmitActions, dispatch),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cart)