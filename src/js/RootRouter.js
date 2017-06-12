import React from 'react'
import {Router, Route, IndexRedirect, Redirect} from 'react-router'
import {
  App,
  Lnk,
  Login,
  Register,
  Reset,
  Home,
  Template,
  SearchPage,
  Cart,
  Mine,
  Life,
  LifeDetail,
  Product,
  Catelog,
  List,
  NotFoundPage,
  Personal,
  Order,
  OrderDetails,
  Express,
  ApplyRefund,
  PayResult,
  Coin,
  CoinDetail,
  Card,
  CardDetail,
  Coupon,
  Addresses,
  EditDetail,
  EditName,
  Refunds,
  RefundDetail,
  RefundTrace,
  RefundInfo,
  SubmitOrder,
  PayOrder,
  YiwuAppTargetJump,
  //活动
  PurchaseLimit,
  PurchaseLimitYX
} from './containers'

class RootRouter extends React.Component {

  checkLogin = (nextState, replace, next) => {
    if (!localStorage.userInfo) {
      replace('/login');
      next();
    }
    next()
  }

  render() {
    const {history} = this.props;
    return (
      <Router history={history}>
        <Route path="/" component={App}>
          <IndexRedirect to="/home"/>
          <Route path="/home" component={Home}/>
          <Route path="/home/template/:id" component={Template}/>
          <Route path="/life" component={Life}/>
          <Route path="/life/:id" component={LifeDetail}/>
          <Route path="/cart/:type" component={Cart} onEnter={this.checkLogin}/>
          <Route path="/mine" component={Mine} onEnter={this.checkLogin}/>
          <Route path="/mine/personal" component={Personal}/>
          <Route path="/mine/personal/edit_name" component={EditName}/>
          <Route path='/mine/order/:status' component={Order}/>
          <Route path="/mine/order/order_detail/:orderId" component={OrderDetails}/>
          <Route path="/mine/express/:expressCorp/:expressNum" component={Express}/>
          <Route path='/mine/refund' component={Refunds}/>
          <Route path="/mine/applyrefund/:data" component={ApplyRefund}/>
          <Route path='/mine/refund/:data' component={RefundDetail}/>
          <Route path='/mine/refund/:requestId/refundtrace' component={RefundTrace}/>
          <Route path='/mine/applyrefund/:requestId/refundinfo' component={RefundInfo}/>
          <Route path='/mine/coin' component={Coin}/>
          <Route path="/mine/coin/:type/:sequenceId" component={CoinDetail}/>
          <Route path='/mine/card' component={Card}/>
          <Route path="/mine/card/detail/:id" component={CardDetail}/>
          <Route path='/mine/coupon' component={Coupon}/>
          <Route path='/mine/address' component={Addresses}/>
          <Route path="/mine/address/detail" component={EditDetail}/>
          <Route path="/mine/address/detail/:id" component={EditDetail}/>
          <Route path="/product/:id" component={Product}/>
          <Route path="/submit_order" component={SubmitOrder}/>
          <Route path="/catelog" component={Catelog}/>
          <Route path="/catelog/:id" component={Catelog}/>
          <Route path="/pay_order/:data" component={PayOrder}/>
          <Route path="/pay_result" component={PayResult}/>
          <Route path="/search" component={SearchPage}/>
          <Route path="/list" component={List}/>
          <Route path="/login" component={Login}/>
          <Route path="/register" component={Register}/>
          <Route path="/reset" component={Reset}/>
          <Route path="/activity/purchaselimit" component={PurchaseLimit}/>
          <Route path="/activity/purchaselimityx" component={PurchaseLimitYX}/>
          <Route path="/lnk" component={Lnk}/>
          <Route path="/yiwuapp_targetjump" component={YiwuAppTargetJump}/>
          <Route path="/404" component={NotFoundPage}/>
          <Redirect from='*' to='/home' />
        </Route>
      </Router>
    )
  }
}

export default RootRouter;
