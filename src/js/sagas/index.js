// saga 模块化引入
import {fork} from 'redux-saga/effects'

// 一些同步逻辑
import {watchPresubmit, watchError} from './cogradient'

// 异步逻辑
import {watchProduct, watchRichDetail, watchProductIntrest, watchCheckoutProduct} from './product'
import {watchSearch} from './search'
import {watchShowcaseList, watchShowcaseTemplate, watchTemplate, watchRecommond, watchProductList} from './showcase'
import {watchCatelog} from './catelog'
import {watchLogin, watchGetVerification, watchRegister, watchReset, watchSaveRegisterParams} from './account'
import {watchLife, watchArticle, watchAddId} from './life'
import {
  watchCartList,
  watchAddCart,
  watchOpenModal,
  watchAddCartSuccess,
  watchUpdateCart,
  watchRemoveCart,
  watchCheckoutOrder
} from './cart'
import {watchGetUserMsg} from './mine'
import {watchWallet, watchJournal, watchJournalDetail} from './wallet'
import {watchQueryCard, watchCardDetail} from './ewuCard'
import {watchAddressDetail, watchAddresses, watchDefaultAddress, watchEditAddress} from './address'
import {watchQueryPayResult, watchChoosePayWay, watchPay, watchGetYiwuCoin} from './pay'
import {
  watchGetOrderList,
  watchGetOrderDetail,
  watchDeleteOrder,
  watchCancelOrder,
  watchExtendedOrder,
  watchConfirmOrder,
  watchGetExpress,
  watchQueryNowTime
} from './orders'
import {
  watchGetRefunds,
  watchGetRefundDetail,
  watchGetRefundTrace,
  watchQueryApplyRefund,
  watchQueryRefundInfo,
  watchQueryJdReturn
} from './refunds'
import {watchGetTimeLimitList, watchGetTimeLimitedDetail} from './activity'
import {watchGetCouponList, watchDeleteCoupon} from './coupon'
import {watchGetPromotion, watchCalculate, watchSubmitOrder} from './submitOrder'
import {watchEditPersonal} from './personal'

// 单一进入点，一次启动所有 Saga
export default function* rootSaga() {
  yield [
    //登录
    fork(watchLogin),
    fork(watchGetVerification),
    fork(watchRegister),
    fork(watchReset),
    fork(watchSaveRegisterParams),
    //商品详情页
    fork(watchProduct),
    fork(watchRichDetail),
    fork(watchProductIntrest),
    fork(watchSearch),
    fork(watchCheckoutProduct),
    //首页
    fork(watchShowcaseList),
    fork(watchShowcaseTemplate),
    fork(watchTemplate),
    fork(watchRecommond),
    fork(watchProductList),
    //类目
    fork(watchCatelog),
    //生活
    fork(watchLife),
    fork(watchAddId),
    fork(watchArticle),
    //购物车
    fork(watchCartList),
    fork(watchAddCart),
    fork(watchAddCartSuccess),
    fork(watchUpdateCart),
    fork(watchRemoveCart),
    fork(watchCheckoutOrder),
    fork(watchOpenModal),
    //我的
    fork(watchGetUserMsg),
    //钱包
    fork(watchWallet),
    fork(watchJournal),
    fork(watchJournalDetail),
    fork(watchQueryCard),
    fork(watchCardDetail),
    //地址
    fork(watchDefaultAddress),
    fork(watchAddresses),
    fork(watchAddressDetail),
    fork(watchEditAddress),
    //支付
    fork(watchQueryPayResult),
    fork(watchChoosePayWay),
    fork(watchPay),
    fork(watchGetYiwuCoin),
    //订单
    fork(watchGetOrderList),
    fork(watchGetOrderDetail),
    fork(watchDeleteOrder),
    fork(watchCancelOrder),
    fork(watchExtendedOrder),
    fork(watchConfirmOrder),
    fork(watchGetExpress),
    fork(watchQueryNowTime),
    //退款
    fork(watchGetRefunds),
    fork(watchGetRefundDetail),
    fork(watchGetRefundTrace),
    fork(watchQueryApplyRefund),
    fork(watchQueryRefundInfo),
    fork(watchQueryJdReturn),
    //提交订单
    fork(watchGetPromotion),
    fork(watchCalculate),
    fork(watchSubmitOrder),
    //活动
    fork(watchGetTimeLimitList),
    fork(watchGetTimeLimitedDetail),

    //优惠券
    fork(watchGetCouponList),
    fork(watchDeleteCoupon),

    //修改用户个人信息
    fork(watchEditPersonal),

    //同步逻辑
    fork(watchPresubmit),
    fork(watchError),
  ]
}