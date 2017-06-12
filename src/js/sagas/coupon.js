/**
 * Created by HEro on 2017/5/16.
 */
import {put, call} from 'redux-saga/effects'
import {takeEvery} from 'redux-saga'
import {fetchApi, urlApi, Constant} from 'service'
import {
  QUERY_COUPON,
  QUERY_COUPON_SUCCESS,
  END_COUPON_CTRL,
  ERROR,
  DELETE_COUPON,
  OPEN_CONFIRM_MODAL,
  CLOSE_CONFIRM_MODAL,
} from 'actions/actionsTypes'

function*  getCouponList(action) {
  try {
    let search = {
      account: localStorage.account,
      status: action.status,
      page: 0,
      size: 10
    }
    let params = {url: urlApi.coupon.query, search: search}
    let json = yield call(fetchApi.get, params);
    if (json.success) {
      let coupons = json.coupons;
      yield[put({type: QUERY_COUPON_SUCCESS, status: action.status, coupons})]
    } else {
      yield[
        put({type: END_COUPON_CTRL}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_COUPON_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchGetCouponList() {
  yield takeEvery(QUERY_COUPON, getCouponList);
}

function* deleteCoupon(action) {
  try {
    let searchParams = {account: localStorage.account, couponId: action.couponId};
    let json = yield call(fetchApi.post, {url: urlApi.coupon.delete, search: searchParams});
    if (json.success) {
      yield [
        put({type: END_COUPON_CTRL}),
        put({type: ERROR, error: "删除优惠券成功"}),
        put({type: QUERY_COUPON, status: action.status})
      ]
    } else {
      yield [
        put({type: END_COUPON_CTRL}),
        put({type: ERROR, error: json.msg}),
        put({type: QUERY_COUPON, status: action.status})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_COUPON_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchDeleteCoupon() {
  yield takeEvery(DELETE_COUPON, deleteCoupon)
}