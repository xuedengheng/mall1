/**
 * Created by Ben on 2016/12/13.
 */
import React, {Component} from 'react';
import styles from './index.scss'
import {
  ImgSwiper,
  DetailFont,
  PFDescription,
  BottomButton,
  FreePostage,
  DetailTab,
  Loading,
  SplitLine,
  FixHeader,
  ProductModal,
  AddCartModal,
  PromotionsModal,
  SelectAddress,
  SetHelmet
} from 'components'
import {Link, hashHistory} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {Toast} from 'antd-mobile'
import {urlApi, fetchApi, checkoutTime} from 'service'
import * as ProductActions from 'actions/ProductActions'
import * as PresubmitActions from 'actions/PresubmitActions'
import * as CartActions from 'actions/CartActions'

const ADDCART = 0;
const BUY = 1;

class Product extends Component {

  constructor(props) {
    super(props);
    this.state = {
      hadStorage: true,
      addressVisible: false,
      promotionVisible: false,
      isTimeLimit: false,
      timeLimit: {
        status: '',
        countdownValue: ''
      },
      selectedArea: null
    }
  }

  componentDidMount() {
    const area = localStorage.areaKey;
    if (area) {
      this.setState({selectedArea: JSON.parse(area)})
    }
    this.handleChange(this.props.params.id);
  }

  componentWillReceiveProps(nextProps) {
    const {selectedArea} = this.state;
    const {product} = nextProps;
    if (this.props.params.id !== nextProps.params.id) {
      this.handleChange(nextProps.params.id)
    }
    if (product.activity && product.activityType === "TIME_LIMITATION" && this.props.product.activityId !== product.activityId) {
      this._handleTimeLimitation(product.activity)
    } else if (this.props.product.activityType === "TIME_LIMITATION" && !product.activity) {
      this.setState({isTimeLimit: false})
    }
    if (this.props.product !== product && product.storeId && product.storeId === 'JD' && selectedArea) {
      this.checkJdStorage(selectedArea, product.sku)
    }
  }

  componentWillUnmount() {
    this.Timer && clearInterval(this.Timer);
    this.props.productActions.initProduct();
    this.close();
  }

  _handleTimeLimitation = activity => {
    this.Timer && clearInterval(this.Timer);
    const {minPrice, start, end} = activity;
    fetchApi.get({url: urlApi.system.now})
      .then(({result: now}) => {
        let nowTime = new Date(now.replace(/-/g, '/')).getTime();
        let startTime = new Date(start.replace(/-/g, '/')).getTime();
        let endTime = new Date(end.replace(/-/g, '/')).getTime();
        this.setState({isTimeLimit: true})
        this._setInterval(nowTime, startTime, endTime, minPrice);
      }).catch(e => Toast.info("网络请求失败，请检查您的网络"))
  }

  _setInterval = (nowTime, startTime, endTime, minPrice) => {
    if (nowTime > startTime && nowTime < endTime) {
      this.setState({timeLimit: {...this.state.timeLimit, status: '已开始'}});
      let start = nowTime,
        end = endTime;
      this.Timer = setInterval(() => {
        let leftTime = end - start;
        if (!leftTime) {
          clearInterval(this.Timer);
          this.handleChange(this.props.params.id);
          this._handleTimeLimitation(this.props.product.activity);
          this.close();
        }
        let hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
        let mm = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟数
        let ss = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
        this.setState({
          timeLimit: {
            ...this.state.timeLimit,
            countdownValue: `离结束还有  ${checkoutTime(hh)}:${checkoutTime(mm)}:${checkoutTime(ss)}`
          }
        });
        start += 1000;
      }, 1000);
    } else if (nowTime < startTime) {
      this.setState({timeLimit: {...this.state.timeLimit, status: `¥${minPrice}`}});
      let start = nowTime,
        end = startTime;
      this.Timer = setInterval(() => {
        let leftTime = end - start;
        if (!leftTime) {
          clearInterval(this.Timer);
          this.handleChange(this.props.params.id);
          this._handleTimeLimitation(this.props.product.activity);
          this.close();
        }
        let hh = parseInt(leftTime / 1000 / 60 / 60 % 24, 10);//计算剩余的小时数
        let mm = parseInt(leftTime / 1000 / 60 % 60, 10);//计算剩余的分钟数
        let ss = parseInt(leftTime / 1000 % 60, 10);//计算剩余的秒数
        this.setState({
          timeLimit: {
            ...this.state.timeLimit,
            countdownValue: `离开启还有  ${checkoutTime(hh)}:${checkoutTime(mm)}:${checkoutTime(ss)}`
          }
        });
        start += 1000;
      }, 1000);
    }
  }

  handleChange = (productId) => {
    this.props.productActions.fetchProduct(productId);
  }

  openModal = (type) => {
    if (!localStorage.userInfo) {
      hashHistory.push('/login');
      return
    }
    this.props.productActions.toggleProductModal(true, type);
  }

  close = () => {
    this.props.productActions.toggleProductModal(false);
  }

  submit = (params, type) => {
    switch (type) {
      case BUY:
        this.props.productActions.checkoutProduct(params);
        break;
      case ADDCART:
        this.props.cartActions.addCart(params, true, this.props.params.id);
        break;
      default:
        break;
    }
  }

  handleClick = (activeKey) => {
    this.props.productActions.setActiveKey(activeKey)
  }

  openCartModal = (id) => {
    if (localStorage.account) {
      let search = {
        productId: id
      }
      let params = {
        url: urlApi.product.detail,
        search: search
      }
      this.props.cartActions.openCartModal(params);
    } else {
      hashHistory.push({
        pathname: '/login'
      });
    }
  }

  openPromoModal = () => {
    this.setState({promotionVisible: true})
  }

  closePromoModal = () => {
    this.setState({promotionVisible: false})
  }

  hide = () => {
    this.props.cartActions.closeCartModal();
  }

  renderAreaCode = addr => {
    let area = '';
    area += addr.selectedProvince ? addr.selectedProvince.id : '0';
    area += addr.selectedCity ? `_${addr.selectedCity.id}` : '_0';
    area += addr.selectedCounty ? `_${addr.selectedCounty.id}` : '_0';
    area += addr.selectedTown ? `_${addr.selectedTown.id}` : '_0';
    return area
  }

  renderAreaName = () => {
    const {selectedArea} = this.state
    let area = ''
    if (selectedArea.selectedProvince) {
      area += selectedArea.selectedProvince.name
    }
    if (selectedArea.selectedCity) {
      area += selectedArea.selectedCity.name
    }
    if (selectedArea.selectedCounty) {
      area += selectedArea.selectedCounty.name
    }
    if (selectedArea.selectedTown) {
      area += selectedArea.selectedTown.name
    }
    return area
  }

  setAddress = (addr) => {
    localStorage.setItem('areaKey', JSON.stringify(addr));
    this.checkJdStorage(addr, this.props.product.sku)
  }

  openAddressModal = () => {
    this.setState({addressVisible: true})
  }

  closeAddressModal = () => {
    this.setState({addressVisible: false})
  }

  checkJdStorage = (addr, skus) => {
    let params = {
      url: urlApi.storage.query,
      search: {
        area: this.renderAreaCode(addr),
        skuNums: skus.map(item => {
          return {
            num: 1,
            skuId: Number(item.thirdSkuid)
          }
        })
      }
    }
    fetchApi.postJson(params)
      .then(json => {
        if (json.result.length > 0) {
          let hadStorage = true;
          for (let i = 0, len = json.result.length; i < len; i++) {
            if (json.result[i].stockStateId === 34) {
              hadStorage = false;
              break;
            }
          }
          this.setState({hadStorage})
        } else {
          this.setState({hadStorage: false})
        }
      }).catch(error => {
      if (error.code) Toast.info(error.message);
      console.log(error)
    })
    this.setState({
      selectedArea: addr,
      addressVisible: false
    })
  }

  render() {
    const settings = {
      autoplay: true,
      infinite: true,
      arrows: false,
      dots: true,
      touchMove: true,
      slidesToShow: 1,
      speed: 500
    }
    const {isTimeLimit, timeLimit, addressVisible, promotionVisible, selectedArea, hadStorage} = this.state;
    const {
      product,
      richDetail,
      search,
      isFetchingSearch,
      isFetchingProduct,
      type,
      visible,
      attributes,
      stocks,
      activeKey,
      cartActions,
      isFetchingCartData,
      cartVisible,
      cartAttributes,
      cartStocks,
      cartProduct
    } = this.props;
    const {productId, status, stock, pictureUrls, picture, name, storeId, storeName, price, originPrice, introduce, freightFreeThreshold, sellCount, promotions} = product;

    const isValid = (product.length === 0 || (status === '1' && parseInt(stock) > 0)) && hadStorage;
    const deductPromo = promotions && _.find(promotions, promo => promo.type === 'DEDUCTION');

    const stockEmptyText = product.storeId && product.storeId === 'JD' ? '非常抱歉，您所选配送地区该商品暂时缺货' : '非常抱歉，该商品暂时缺货'

    return (
      <div>
        <SetHelmet title={name} keywords={introduce}/>
        {
          (isFetchingProduct || isFetchingSearch || isFetchingCartData) && <Loading/>
        }
        {/*<FixHeader hightLight={false}/>*/}
        <div className={styles.pictureWrapper}>
          <ImgSwiper pictureUrls={pictureUrls} picture={picture} {...settings}/>
          {
            isTimeLimit &&
            <Link to="/activity/purchaselimit" className={styles.activity}>
              <div className={styles.leftWrapper}>
                <p className={styles.icon}>
                  <img className="img-responsive" src={require('../../../images/product/xianshigou.png')} alt=""/>
                </p>
                <p className={styles.status}>{timeLimit.status}</p>
              </div>
              <div className={styles.rightWrapper}>
                <span>{timeLimit.countdownValue}</span>
                <span className={`arrow-right-white ${styles.arrow}`}/>
              </div>
            </Link>
          }
        </div>
        <DetailFont name={name} storeId={storeId} price={price} originPrice={originPrice} sellCount={sellCount}/>
        <SplitLine />
        <PFDescription introduce={introduce} storeName={storeName}/>
        <SplitLine />
        <FreePostage freightFreeThreshold={freightFreeThreshold} storeName={storeName}/>
        {
          deductPromo ?
            <div className={styles.promoWrapper} onClick={this.openPromoModal}>
              <p className={styles.leftContent}>{promotions.length}个优惠</p>
              <p className={styles.rightContent}>
                <span className={styles.label}>{deductPromo.label}</span>
                <span>{deductPromo.name}</span>
              </p>
              <p className={styles.arrow}><i className="arrow-right"/></p>
            </div> : null
        }
        {
          storeId && storeId === 'JD' &&
          <div className={styles.promoWrapper} onClick={this.openAddressModal}>
            <p className={styles.leftContent}>送至</p>
            <p className={styles.rightContent}>
              <span>{selectedArea ? this.renderAreaName() : '请选择'}</span>
            </p>
            <p className={styles.arrow}><i className="arrow-right"/></p>
          </div>
        }
        <SplitLine />
        <DetailTab description={richDetail ? richDetail : ''} data={search}
                   handleClick={this.handleClick} activeKey={activeKey} openCartModal={this.openCartModal}/>
        <BottomButton productId={productId} openModal={this.openModal} isValid={isValid}
                      stockEmptyText={stockEmptyText}/>
        {
          (attributes.length && stocks.length) &&
          <ProductModal data={product} attributes={attributes} stocks={stocks} submit={this.submit}
                        visible={visible} type={type} close={this.close}/>
        }
        <AddCartModal onClose={::this.hide}
                      visible={cartVisible}
                      data={cartProduct}
                      attributes={cartAttributes}
                      stocks={cartStocks}
                      action={cartActions}/>
        {
          deductPromo &&
          <PromotionsModal onClose={::this.closePromoModal} visible={promotionVisible} promotion={deductPromo}/>
        }
        <SelectAddress setAddress={this.setAddress} visible={addressVisible} onClose={this.closeAddressModal}/>
      </div>
    )

  }
}

const mapStateToProps = state => ({
  isFetchingProduct: state.product.isFetching,
  isFetchingCartData: state.cart.isFetching,
  visible: state.product.visible,
  type: state.product.type,
  product: state.product.product,
  richDetail: state.product.richDetail,
  attributes: state.product.attributes,
  stocks: state.product.stocks,
  activeKey: state.product.activeKey,
  search: state.product.search,
  cartVisible: state.cart.visible,
  cartAttributes: state.cart.attributes,
  cartStocks: state.cart.stocks,
  cartProduct: state.cart.product
})

const mapDispatchToProps = dispatch => ({
  productActions: bindActionCreators(ProductActions, dispatch),
  presubmitActions: bindActionCreators(PresubmitActions, dispatch),
  cartActions: bindActionCreators(CartActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Product)