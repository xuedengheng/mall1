/**
 * Created by Ben on 2017/4/1.
 */
import {takeEvery} from 'redux-saga'
import {put, call} from 'redux-saga/effects'
import {fetchApi, urlApi, Tool, OrderStatus} from 'service'
import {
  QUERY_ORDER_LIST,
  QUERY_ORDER_LIST_SUCCESS,
  QUERY_ORDER_DETAIL,
  QUERY_ORDER_DETAIL_SUCCESS,
  DELETE_ORDER,
  CANCEL_ORDER,
  CONFIRM_ORDER,
  EXTENDED_ORDER,
  QUERY_EXPRESS,
  QUERY_EXPRESS_SUCCESS,
  QUERY_NOWTIME,
  QUERY_NOWTIME_SUCCESS,
  OPEN_CONFIRM_MODAL,
  CLOSE_CONFIRM_MODAL,
  ORDER_END,
  ERROR
} from 'actions/actionsTypes'

function* getOrderList(action) {
  try {
    let searchParams = {
      mobilePhone: localStorage.account,
      pageNo: 1,
      pageSize: (action.page ? action.page : 1) * 10,
      orderStatus: action.status !== OrderStatus.all ? action.status : null
    }
    let data = yield call(fetchApi.get, {url: urlApi.order.queryList + Tool.setSearchParams(searchParams)});
    if (data.success) {
      yield put({type: QUERY_ORDER_LIST_SUCCESS, status: action.status, result: data.result})
    } else {
      yield [
        put({type: ORDER_END}),
        put({type: ERROR, error: data.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ORDER_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}
export function* watchGetOrderList() {

  yield takeEvery(QUERY_ORDER_LIST, getOrderList)
}

function* getOrderDetail(action) {
  try {
    let searchParams = {mobilePhone: localStorage.account, orderId: action.orderId};
    let data = yield call(fetchApi.get, {url: urlApi.order.orderDetail + Tool.setSearchParams(searchParams)});
    if (data.success) {
      let orderId = data.result.orderId;
      let refundamount = data.result.parcelList[0].orderDetailList[0].amount;
      let time = data.result.createTime;
      let orderStatus = data.result.orderStatus;
      let deadtime = data.result.parcelList.map(item => {
        return {
          deadtime: item.deadline
        }
      });
      let parcelstatus = data.result.parcelList.map(item => {
        return {
          parcelitem: item.status
        }
      });
      yield put({
        type: QUERY_ORDER_DETAIL_SUCCESS,
        orderId,
        refundamount,
        time,
        deadtime,
        parcelstatus,
        orderStatus,
        result: data.result
      })
    } else {
      yield [
        put({type: ORDER_END}),
        put({type: ERROR, error: data.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ORDER_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchGetOrderDetail() {
  yield takeEvery(QUERY_ORDER_DETAIL, getOrderDetail)
}

function* deleteOrder(action) {
  try {
    let searchParams = {mobilePhone: localStorage.account, orderId: action.orderId};
    let json = yield call(fetchApi.get, {url: urlApi.order.deleteOrder + Tool.setSearchParams(searchParams)})
    if (json.success) {
      yield [
        put({type: ORDER_END}),
        put({type: CLOSE_CONFIRM_MODAL}),
        put({type: ERROR, error: "删除订单成功"}),
        put({type: QUERY_ORDER_LIST, status: action.status, page: action.page})
      ]
    } else {
      yield [
        put({type: ORDER_END}),
        put({type: CLOSE_CONFIRM_MODAL}),
        put({type: ERROR, error: json.msg}),
        put({type: QUERY_ORDER_LIST, status: action.status, page: action.page})
      ]
    }
  } catch (e) {
    yield [
      put({type: ORDER_END}),
      put({type: CLOSE_CONFIRM_MODAL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchDeleteOrder() {
  yield takeEvery(DELETE_ORDER, deleteOrder)
}

function* cancelOrder(action) {
  try {
    let searchParams = {mobilePhone: localStorage.account, orderId: action.orderId};
    let json = yield call(fetchApi.get, {url: urlApi.order.cancelOrder + Tool.setSearchParams(searchParams)});
    if (json.success) {
      yield [
        put({type: ORDER_END}),
        put({type: CLOSE_CONFIRM_MODAL}),
        put({type: ERROR, error: "取消订单成功"}),
      ]
      if (action.page) {
        yield put({type: QUERY_ORDER_LIST, status: action.status, page: action.page});
      } else {
        yield put({type: QUERY_ORDER_DETAIL, orderId: action.orderId});
      }
    } else {
      yield [
        put({type: ORDER_END}),
        put({type: CLOSE_CONFIRM_MODAL}),
        put({type: ERROR, error: json.msg}),
      ]
      if (action.page) {
        yield put({type: QUERY_ORDER_LIST, status: action.status, page: action.page});
      } else {
        yield put({type: QUERY_ORDER_DETAIL, orderId: action.orderId});
      }
    }
  } catch (e) {
    yield [
      put({type: ORDER_END}),
      put({type: CLOSE_CONFIRM_MODAL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchCancelOrder() {
  yield takeEvery(CANCEL_ORDER, cancelOrder)
}

function* queryNowTime() {
  try {
    let json = yield call(fetchApi.get, {url: urlApi.system.now})
    if (json.success) {
      yield [
        put({
          type: QUERY_NOWTIME_SUCCESS,
          nowTime: json.result
        }),
      ]
    } else {
      yield [
        put({type: ORDER_END}),
        put({type: ERROR, error: json.msg}),
      ]
    }
  } catch (e) {
    yield [
      put({type: ORDER_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchQueryNowTime() {
  yield takeEvery(QUERY_NOWTIME, queryNowTime)
}

function* extendedOrder(action) {
  try {
    let searchParams = {mobilePhone: localStorage.account, parcelId: action.parcelId}
    let json = yield call(fetchApi.get, {url: urlApi.order.extendedOrder + Tool.setSearchParams(searchParams)})
    if (json.success) {
      yield [
        put({type: ORDER_END}),
        put({type: CLOSE_CONFIRM_MODAL}),
        put({type: ERROR, error: "延迟收货成功"}),
        put({type: QUERY_ORDER_DETAIL, orderId: action.orderId}),
      ]
    } else {
      yield [
        put({type: ORDER_END}),
        put({type: CLOSE_CONFIRM_MODAL}),
        put({type: ERROR, error: json.msg}),
        put({type: QUERY_ORDER_DETAIL, orderId: action.orderId})
      ]
    }
  } catch (e) {
    yield [
      put({type: ORDER_END}),
      put({type: CLOSE_CONFIRM_MODAL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchExtendedOrder() {
  yield takeEvery(EXTENDED_ORDER, extendedOrder)
}

function* confirmOrder(action) {
  try {
    let searchParams = {mobilePhone: localStorage.account, parcelId: action.parcelId}
    let json = yield call(fetchApi.get, {url: urlApi.order.confirmOrder + Tool.setSearchParams(searchParams)});
    if (json.success) {
      yield [
        put({type: ORDER_END}),
        put({type: CLOSE_CONFIRM_MODAL}),
        put({type: ERROR, error: "确认收货成功"}),
        put({type: QUERY_ORDER_DETAIL, orderId: action.orderId})
      ]
    } else {
      yield [
        put({type: ORDER_END}),
        put({type: CLOSE_CONFIRM_MODAL}),
        put({type: ERROR, error: json.msg}),
        put({type: QUERY_ORDER_DETAIL, orderId: action.orderId})
      ]
    }
  } catch (e) {
    yield [
      put({type: ORDER_END}),
      put({type: CLOSE_CONFIRM_MODAL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchConfirmOrder() {
  yield takeEvery(CONFIRM_ORDER, confirmOrder)
}

function* getExpress(action) {
  try {
    let searchParams = {
      mobilePhone: localStorage.account,
      jdOrderId: action.expressNum,
    }
    let data = yield call(fetchApi.get, {url: urlApi.order.logistics + Tool.setSearchParams(searchParams)});
    if (data.success) {
      let orderTrack = data.result.result?data.result.result.orderTrack:[];
      yield put({type: QUERY_EXPRESS_SUCCESS, orderTrack, result: data.result})
    } else {
      yield [
        put({type: ERROR, error: data.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ERROR, error: e.message})
    ]
  }
}

export function* watchGetExpress() {
  yield takeEvery(QUERY_EXPRESS, getExpress)
}


