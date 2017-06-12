/**
 * Created by Ben on 2017/1/5.
 */
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import ReactPullLoad, {STATS} from 'react-pullload'
import {
  Loading,
  ListHeader,
  OrderBy,
  NavBar,
  RenderIcon,
  RenderLoading,
  HeaderNode,
  FooterNode,
  AddCartModal,
  SetHelmet
} from 'components'
import {Toast} from 'antd-mobile'
import styles from './index.scss'
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {api, urlApi, getQueryString, fetchApi, Tool} from 'service'
import * as SearchActions from 'actions/SearchActions'
import * as CartActions from 'actions/CartActions'

class List extends Component {
  constructor(props) {
    super(props);
    this.query = this.props.location.query;
    this.state = {
      sortCol: '',
      sortOrder: '',
      page: 0,
      data: [],
      hasMore: true,
      action: STATS.init
    }
  }

  componentDidMount() {
    if (this.query) {
      this.mySearch = {
        pageSize: 20,
        pageNo: this.state.page,
        sortCol: this.state.sortCol,
        sortOrder: this.state.sortOrder,
        brandCodes: this.query.brandCodes ? this.query.brandCodes : '',
        catalogIds: this.query.catalogIds ? this.query.catalogIds : '',
        names: this.query.names ? decodeURIComponent(this.query.names) : '',
      };
      this.props.searchActions.fetchSearch(this.mySearch)
    }

  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.search.length > 0) {
      this.setState({data: nextProps.search})
    }
  }

  componentWillUnmount() {
    this.props.searchActions.initSearch();
    this.hide()
  }

  back = () => {
    hashHistory.goBack();
  }

  getData = (status, pageNo, sortCol, sortOrder) => {
    if (this.query) {
      this.mySearch.pageNo = pageNo ? pageNo : this.state.page;
      this.mySearch.sortCol = sortCol ? sortCol : this.state.sortCol;
      this.mySearch.sortOrder = sortOrder ? sortOrder : this.state.sortOrder;
      fetchApi.get({url: urlApi.search.query + Tool.setSearchParams(this.mySearch)})
        .then(json => {
          if (json.success) {
            const hasMore = json.total > this.state.data.length;
            const data = status ? json.result : [...this.state.data, ...json.result];
            this.setState({
              hasMore,
              data,
              action: status ? STATS.refreshed : STATS.reset
            })
          } else {
            Toast.info(json.msg);
            this.setState({
              hasMore: true,
              action: status ? STATS.refreshed : STATS.reset
            })
          }
        }).catch(e => {
        Toast.info("网络请求失败，请检查您的网络");
        this.setState({hasMore: true, action: status ? STATS.refreshed : STATS.reset})
      })
      this.setState({
        page: parseInt(pageNo) > 0 ? pageNo : 0,
        action: status ? STATS.refreshing : STATS.loading
      });
    }
  }

  handleClick = (sortCol, sortOrder) => {
    this.setState({
      sortCol: sortCol,
      sortOrder: sortOrder,
      page: 0,
    });
    if (!this.props.none)
      this.getData(true, "0", sortCol, sortOrder);
  }

  handleAction(action) {
    if (action === this.state.action) return false;
    if (action === STATS.refreshing) {
      this.handRefreshing()
    } else if (action === STATS.loading) {
      this.handLoadMore()
    } else {
      this.setState({action})
    }
  }

  handRefreshing() {
    this.handleClick(this.state.sortCol, this.state.sortOrder)
  }

  handLoadMore() {
    if (this.state.hasMore) {
      this.getData(false, this.state.page + 1)
    }
  }

  openModal = (id) => {
    if (localStorage.userInfo) {
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

  hide = () => {
    this.props.cartActions.closeCartModal()
  }

  add = (productId, skuId, quantity) => {
    let mobilePhone = JSON.parse(localStorage.userInfo).mobile;
    let params = {
      url: urlApi.cart.add,
      search: {
        mobilePhone: mobilePhone,
        productId: productId,
        skuId: skuId,
        quantity: quantity
      }
    };
    this.props.cartActions.addCart(params)
  }

  render() {
    const {
      isFetching,
      isFetchingCart,
      visible,
      attributes,
      stocks,
      product,
      cartActions
    } = this.props;
    return (
      <div className={styles.resultWrapper}>
        <SetHelmet title={this.query.title ? this.query.title : "搜索结果"}/>
        {
          (isFetching || isFetchingCart) && <Loading/>
        }
        <AddCartModal onClose={this.hide}
                      visible={visible}
                      data={product}
                      attributes={attributes}
                      stocks={stocks}
                      action={cartActions}/>
        <div>
          <div style={{height: '2rem'}}/>
          <ListHeader back={this.back} value={this.query.names ? this.query.names : ''}/>
          <OrderBy handleClick={this.handleClick}/>
        </div>
        {this.renderList()}
        <NavBar />
      </div>
    )
  }

  renderList = () => {
    const {data, action, hasMore} = this.state;
    if (!this.props.none) {
      return (
        <ReactPullLoad
          downEnough={150}
          action={action}
          handleAction={this.handleAction.bind(this)}
          hasMore={hasMore}
          distanceBottom={100}
          HeadNode={HeaderNode}
          FooterNode={FooterNode}
          style={{overflowY: 'initial'}}>
          <ul>
            {
              data.map((item, index) =>
                <li className={styles.customLi} key={index}>
                  <Link className="block" to={`/product/${item.productId}`}>
                    <div className={styles.imgPanel}>
                      <img src={item.picture} className="img-responsive"/>
                    </div>
                    <div className={styles.detail}>
                      <p className={`font-28 color333 text-overflow-2 ${styles.title}`}>
                        {item.name}
                      </p>
                      <div className={`space-between ${styles.control}`}>
                        <div className={styles.left}>
                          <p className="font-30 color333">
                            ￥{parseFloat(item.price).toFixed(2)}
                            {
                              item.price !== item.originPrice ?
                                <s className="font-24"
                                   style={{
                                     color: '#ababab',
                                     paddingLeft: '.08rem'
                                   }}>{parseFloat(item.originPrice).toFixed(2)}</s> : null
                            }
                          </p>
                          <p className="font-20 color8282">
                            {item.sellCount}人已选
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className={styles.right} onClick={this.openModal.bind(this, item.productId)}>
                    <img src={require('../../../images/base/search_icon_addcar.png')}
                         className="img-responsive"/>
                  </div>
                </li>
              )
            }
          </ul>
        </ReactPullLoad>
      )
    }
    return (
      <div className="empty-box" style={{marginTop: '3.46rem'}}>
        <div className="pic">
          <img src={require('../../../images/base/search_icon_nogoods.png')} alt=""/>
        </div>
        <p className="text">
          抱歉，暂无该商品
        </p>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.search.isFetching,
  isFetchingCart: state.cart.isFetching,
  search: state.search.items,
  none: state.search.none,
  visible: state.cart.visible,
  add: state.cart.add,
  attributes: state.cart.attributes,
  stocks: state.cart.stocks,
  product: state.cart.product
})

const mapDispatchToProps = dispatch => ({
  searchActions: bindActionCreators(SearchActions, dispatch),
  cartActions: bindActionCreators(CartActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(List)