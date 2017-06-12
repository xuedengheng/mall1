/**
 * Created by Ben on 2016/12/12.
 */
import React, {Component} from 'react'
import {hashHistory} from 'react-router'
import {
  Loading,
  SplitLine,
  SearchHeader,
  TabList,
  NavBar,
  FullBanner,
  CenterModeBanner,
  Category,
  Brand,
  OnSale,
  Fresh,
  Quality,
  Recommond,
  HomeInterest,
  AddCartModal,
  SetHelmet
} from 'components';
import styles from './index.scss';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as ShowcaseActions from 'actions/ShowcaseActions'
import * as CartActions from 'actions/CartActions'
import {api, urlApi, Tool} from 'service'

const settings = {
  autoplay: true,
  autoplayInterval: 3000,
  infinite: true,
  dots: true
};

const cSetting = {
  className: 'slideCenter',
  centerMode: true,
  infinite: false,
  arrows: false,
  centerPadding: '120px',
  touchMove: true,
  slidesToShow: 1,
  speed: 500
};

const RSetting = {
  className: 'recommondSlide',
  dots: true,
  infinite: true,
  arrows: false,
  touchMove: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 3
};

class Home extends Component {
  state = {
    visible: false
  }

  componentDidMount() {
    this.props.showcaseActions.fetchShowcaseList({url: urlApi.showcase.list}, this.props.showcaseId);
  }

  componentWillUnmount() {
    this.hide()
  }

  handleClick = showcaseId => {
    let template = {url: urlApi.showcase.template + '/' + showcaseId};
    this.props.showcaseActions.saveShowCaseId(showcaseId);
    this.props.showcaseActions.fetchShowcaseTemplate(template);
  };

  targetClick = (target, id, title) => {
    let items;
    switch (target) {
      case "TEMPLATE":
        hashHistory.push({
          pathname: '/home/template/' + id
        });
        break;
      case "PRODUCT_DETAIL":
        hashHistory.push({
          pathname: '/product/' + id
        });
        break;
      case "CATEGORY_SEARCH":
        items = api.splitString(id);
        hashHistory.push(`/list?catalogIds=${items}&title=${title}`);
        break;
      case "BRAND_SEARCH":
        items = api.splitString(id);
        hashHistory.push(`/list?brandCodes=${items}&title=${title}`);
        break;
      case "URL":
        window.location.href = id;
        break;
      default:
        break;
    }
  };

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
    this.props.cartActions.closeCartModal();
  }

  render() {
    const {
      isFetchingShowcase,
      isFetchingCartData,
      showcaseId,
      list,
      template,
      recommond,
      productList,
      visible,
      attributes,
      stocks,
      product,
      cartActions
    } = this.props;

    let view = [];
    if (template.components && template.components.length) {
      let i = 0;
      let o = 0;
      template.components.map((item, index) => {
        switch (item.type) {
          case "banner":
            if (item.items.length) {
              view.push(
                <FullBanner data={item.items}
                            hackHeight="home-swipe"
                            targetClick={this.targetClick}
                            {...settings}
                            key={index}/>
              );
            }
            break;
          case "choice":
            if (item.items.length) {
              view.push(
                <div className="choice" key={index}>
                  <CenterModeBanner
                    data={item.items}
                    title={item.title}
                    icon={item.icon}
                    targetClick={this.targetClick}
                    {...cSetting} />
                  <SplitLine />
                </div>
              );
            }
            break;
          case "category":
            if (item.items.length) {
              view.push(
                <div className="category" key={index}>
                  <Category
                    data={item.items}
                    margin=".2"
                    targetClick={this.targetClick}
                  />
                </div>
              )
            }
            break;
          case "fresh":
            if (item.items.length) {
              view.push(
                <div className="fresh" key={index}>
                  <Fresh
                    data={item.items}
                    title={item.title}
                    icon={item.icon}
                    targetClick={this.targetClick}/>
                  <SplitLine />
                </div>
              );
            }
            break;
          case "quality":
            if (item.items.length) {
              view.push(
                <div className="quality" key={index}>
                  <Quality
                    data={item.items}
                    title={item.title}
                    icon={item.icon}
                    targetClick={this.targetClick}/>
                  <SplitLine />
                </div>
              );
            }
            break;
          case "brand":
            if (item.items.length) {
              view.push(
                <div className="brand" key={index}>
                  <Brand
                    data={item.items}
                    title={item.title}
                    icon={item.icon}
                    targetClick={this.targetClick}/>
                  <SplitLine />
                </div>
              );
            }
            break;
          case "on_sale":
            if (item.items.length) {
              view.push(
                <div className="on_sale" key={index}>
                  <OnSale data={item.items} targetClick={this.targetClick}/>
                </div>
              )
            }
            break;
          case "recommend":
            if (item.items.length && recommond.length > i) {
              view.push(
                <div className="recommend" key={index}>
                  <Recommond data={recommond[i].result ? recommond[i].result : null}
                             title={item.title}
                             icon={item.icon} {...RSetting}/>
                  <SplitLine />
                </div>
              );
              i++
            }
            break;
          case "product_list":
            if (item.items.length && productList.length > o) {
              view.push(<HomeInterest key={index}
                                      data={productList[o].result ? productList[o].result : ''}
                                      title={item.title}
                                      icon={item.icon} openModal={::this.openModal}/>);
              o++
            }
            break;
          default:
            break;
        }
      })
    }
    return (
      <div ref="box" className="overflow-h">
        <SetHelmet title="首页"/>
        {
          (isFetchingShowcase || isFetchingCartData) && <Loading />
        }
        <AddCartModal onClose={::this.hide}
                      visible={visible}
                      data={product}
                      attributes={attributes}
                      stocks={stocks}
                      action={cartActions}/>
        <div className={styles.root}>
          <div className={styles.cHeight}/>
          <div className={styles.fTop}>
            <SearchHeader />
            <TabList list={list} showcaseId={showcaseId} handleClick={this.handleClick}/>
          </div>
        </div>
        {view}
        <NavBar />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetchingShowcase: state.showcase.isFetching,
  isFetchingCartData: state.cart.isFetching,
  showcaseId: state.showcase.showcaseId,
  list: state.showcase.list,
  template: state.showcase.template,
  recommond: state.showcase.recommond,
  productList: state.showcase.items,
  visible: state.cart.visible,
  add: state.cart.add,
  attributes: state.cart.attributes,
  stocks: state.cart.stocks,
  product: state.cart.product
});

const mapDispatchToProps = dispatch => ({
  showcaseActions: bindActionCreators(ShowcaseActions, dispatch),
  cartActions: bindActionCreators(CartActions, dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home)
