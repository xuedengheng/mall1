/**
 * Created by Ben on 2017/4/19.
 */
import {takeEvery} from 'redux-saga'
import {put, call} from 'redux-saga/effects'
import {fetchApi, urlApi} from 'service'
import history from 'service/history';
import {
  GET_REFUNDS,
  GET_REFUNDS_SUCCESS,
  GET_REFUND_DETAIL,
  GET_REFUND_DETAIL_SUCCESS,
  GET_REFUND_TRACE,
  GET_REFUND_TRACE_SUCCESS,
  QUERY_APPLYREFUND,
  QUERY_APPLYREFUND_SUCCESS,
  QUERY_REFUNDINFO,
  QUERY_REFUNDINFO_SUCCESS,
  QUERY_JD_RETURN,
  QUERY_JD_RETURN_SUCCESS,
  END_REFUNDS_CTRL,
  ERROR
} from 'actions/actionsTypes'

function* getRefunds() {
  try {
    let json = yield call(fetchApi.get, {url: `${urlApi.postpurchase.list}/${localStorage.account}/0/20`})
    if (json.success) {
      yield put({type: GET_REFUNDS_SUCCESS, payload: json.details})
    } else {
      yield [
        put({type: END_REFUNDS_CTRL}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_REFUNDS_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchGetRefunds() {
  yield takeEvery(GET_REFUNDS, getRefunds)
}

function* getRefundDetail(action) {
  try {
    let json;
    if (action.data.orderId && action.data.skuId) {
      json = yield call(fetchApi.get, {url: `${urlApi.postpurchase.detail}/${action.data.orderId}/${action.data.skuId}`})
    } else {
      json = yield call(fetchApi.get, {url: `${urlApi.postpurchase.detail}/${action.data}`})
    }
    if (json.success) {
      yield put({type: GET_REFUND_DETAIL_SUCCESS, payload: json.details[0]})
    } else {
      yield [
        put({type: END_REFUNDS_CTRL}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_REFUNDS_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchGetRefundDetail() {
  yield takeEvery(GET_REFUND_DETAIL, getRefundDetail)
}

function* getRefundTrace(action) {
  try {
    let json = yield call(fetchApi.get, {url: `${urlApi.postpurchase.trace}/${action.requestId}`});
    if (json.success) {
      yield put({type: GET_REFUND_TRACE_SUCCESS, payload: json.items})
    } else {
      yield [
        put({type: END_REFUNDS_CTRL}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_REFUNDS_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchGetRefundTrace() {
  yield takeEvery(GET_REFUND_TRACE, getRefundTrace)
}

function* queryApplyRefund(action) {
  try {
    let json;
    if (!action.data.requestId) {
      json = yield call(fetchApi.postJson, {url: `${urlApi.postpurchase.createRefund}`, search: action.data})
    } else {
      json = yield call(fetchApi.postJson, {url: `${urlApi.postpurchase.updateRefund}`, search: action.data})
    }
    if (json.success) {
      if (!action.data.requestId) {
        yield [put({type: QUERY_APPLYREFUND_SUCCESS}),
          put({type: ERROR, error: '提交成功'})]
        history.goBack();
      } else {
        yield [put({type: QUERY_APPLYREFUND_SUCCESS}),
          put({type: ERROR, error: '修改成功'})]
        history.goBack();
      }
    } else {
      yield [
        put({type: END_REFUNDS_CTRL}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_REFUNDS_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchQueryApplyRefund() {
  yield takeEvery(QUERY_APPLYREFUND, queryApplyRefund)
}

function* queryRefundInfo(action) {
  try {
    let json;
    json = yield call(fetchApi.post, {url: `${urlApi.postpurchase.submit}`, search: action.data})
    if (json.success) {
      yield [put({type: QUERY_REFUNDINFO_SUCCESS}),
        put({type: ERROR, error: '退货成功'})]
      history.goBack();
    } else {
      yield [
        put({type: END_REFUNDS_CTRL}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_REFUNDS_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchQueryRefundInfo() {
  yield takeEvery(QUERY_REFUNDINFO, queryRefundInfo)
}

function* queryJdReturn(action) {
  try {
    let json;
    json = yield call(fetchApi.post, {url: `${urlApi.postpurchase.jdReturned}`, search: action.data})
    if (json.success) {
      yield [put({type: QUERY_JD_RETURN_SUCCESS}),
        put({type: GET_REFUND_DETAIL, data: action.data.requestId})]
    } else {
      yield [
        put({type: END_REFUNDS_CTRL}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_REFUNDS_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchQueryJdReturn() {
  yield takeEvery(QUERY_JD_RETURN, queryJdReturn)
}
