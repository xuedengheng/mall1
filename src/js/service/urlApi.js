/**
 * Created by Ben on 2016/12/29.
 */
const rootUrl = {
  yiwuApi: '/yiwu',
  searchApi: '/search-service',
  jdApi: '/jdapi-service',
  auth: '/auth',
  misc: '/misc-service',
  yiwucoin: '/yiwucoin-yiwu-service',
  account: '/account-service',
  postPurchase: '/postpurchase-service',
  seckill: '/seckill-service'
}

export const urlApi = {
  system: {
    now: rootUrl.yiwuApi + '/system/now'
  },
  product: {
    detail: rootUrl.yiwuApi + '/product/detail.do',
    richDetail: rootUrl.yiwuApi + '/product/richDetail.do',
    jdRichDetail: rootUrl.jdApi + '/product/detail',
    productList: rootUrl.yiwuApi + '/product/listByProductIds.do'
  },
  search: {
    query: rootUrl.searchApi + '/product/query'
  },
  showcase: {
    list: rootUrl.yiwuApi + '/showcase/list',
    template: rootUrl.yiwuApi + '/showcase/template',
  },
  category: {
    query: rootUrl.yiwuApi + '/category/query.do',
    querydouble: rootUrl.yiwuApi + '/category/querydouble.do',
    queryv2: rootUrl.yiwuApi + '/category/query/v2',
    querydoublev2: rootUrl.yiwuApi + '/category/querydouble/v2',
  },
  auth: {
    exist: rootUrl.auth + '/exist',
    getToken: rootUrl.auth + '/getToken',
    sms: rootUrl.account + '/sms/send',
    register: rootUrl.account + '/user/register',
    reset: rootUrl.account + '/user/reset'
  },
  article: {
    query: rootUrl.misc + '/article/query',
    detail: rootUrl.misc + '/article/load'
  },
  cart: {
    query: rootUrl.yiwuApi + '/cart/query',
    add: rootUrl.yiwuApi + '/cart/add',
    remove: rootUrl.yiwuApi + '/cart/remove',
    edit: rootUrl.yiwuApi + '/cart/update'
  },
  wallet: {
    wallet: rootUrl.yiwucoin + '/wallet',
    journal: rootUrl.yiwucoin + '/wallet/journal',
    detail: rootUrl.yiwucoin + '/wallet/journal/querysingle'
  },
  card: {
    query: rootUrl.yiwucoin + '/card/query',
    detai: rootUrl.yiwucoin + '/card/number'
  },
  coupon: {
    query: rootUrl.account + '/usercoupon/list',
    total: rootUrl.account + '/usercoupon/total',
    delete: rootUrl.account + '/usercoupon/remove',
  },
  address: {
    create: rootUrl.account + '/address/create',
    update: rootUrl.account + '/address/update',
    delete: rootUrl.account + '/address/delete',
    query: rootUrl.account + '/address/query',
    queryDetail: rootUrl.account + '/address/queryByAddrId',
    province: rootUrl.jdApi + '/address/province',
    county: rootUrl.jdApi + '/address/county',
    city: rootUrl.jdApi + '/address/city',
    town: rootUrl.jdApi + '/address/town'
  },
  promotion: {
    query: rootUrl.yiwuApi + '/promotion/query',
    calculate: rootUrl.yiwuApi + '/promotion/calculate'
  },
  checkout: {
    submit: rootUrl.yiwuApi + '/checkout/submit/order',
    immediately: rootUrl.yiwuApi + '/checkout/submit/order/immediately',
    presubmitorder: rootUrl.yiwuApi + '/checkout/presubmit/order',
    choosePayWay: rootUrl.yiwuApi + '/checkout/choosepayway.do'
  },
  pay: {
    getToken: rootUrl.yiwuApi + '/pay/gettoken.do',
    weixinpay: rootUrl.yiwuApi + '/pay/weixinpay.do',
    feimapay: rootUrl.yiwuApi + '/pay/feimapay.do',
    feimapayjson: rootUrl.yiwuApi + '/pay/feimapay/json',
    queryPayResult: rootUrl.yiwuApi + '/pay/queryPayResult.do',
    yiwupay: rootUrl.yiwuApi + '/pay/yiwupay.do',
    yiwupayjson: rootUrl.yiwuApi + '/pay/yiwupay/json',
  },
  order: {
    queryList: rootUrl.yiwuApi + '/order/qryorderlist.do',
    cancelOrder: rootUrl.yiwuApi + '/order/cancelorder.do',
    extendedOrder: rootUrl.yiwuApi + '/parcel/delay',
    confirmOrder: rootUrl.yiwuApi + '/parcel/receive',
    deleteOrder: rootUrl.yiwuApi + '/order/deleteorder.do',
    orderDetail: rootUrl.yiwuApi + '/order/qryorderinfo.do',
    receive: rootUrl.yiwuApi + '/parcel/receive',
    stateCount: rootUrl.yiwuApi + '/order/qryOrderStatusCount',
    logistics: rootUrl.yiwuApi + '/order/queryOrderExpress.do',
  },
  postpurchase: {
    list: rootUrl.postPurchase + '/postpurchase/list',
    detail: rootUrl.postPurchase + '/postpurchase/detail',
    trace: rootUrl.postPurchase + '/postpurchase/trace',
    createRefund: rootUrl.postPurchase + '/postpurchase/create',
    updateRefund: rootUrl.postPurchase + '/postpurchase/update',
    submit: rootUrl.postPurchase + '/postpurchase/submit',
    jdReturned: rootUrl.postPurchase + '/postpurchase/jd/returned'
  },
  activity: {
    timeLimitedList: rootUrl.seckill + '/activity/timeLimited/list',
    timeLimitedDetail: rootUrl.seckill + '/activity/timeLimited'
  },
  userinfo: {
    update: rootUrl.account + '/user/update',
  },
  image: {
    testUpload: rootUrl.misc + '/image/upload/test',
    upload: rootUrl.misc + '/image/upload',
    remove: rootUrl.misc + '/image/delete'
  },
  personal: {
    invitations: rootUrl.account + '/personal/invitaions'
  },
  storage: {
    query: rootUrl.jdApi + '/storage/query'
  }
}