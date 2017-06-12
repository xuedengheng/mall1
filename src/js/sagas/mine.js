/**
 * Created by Ben on 2017/4/26.
 */
import {takeEvery} from 'redux-saga'
import {put, call} from 'redux-saga/effects'
import {fetchApi, urlApi} from 'service'
import {GET_USER_MSG, GET_USER_MSG_SUCCESS, END_USER_MSG_CTRL, ERROR} from 'actions/actionsTypes'

function* getUserMsg() {
  try {
    let statusCountJson = yield call(fetchApi.get, {url: urlApi.order.stateCount + '/' + localStorage.account});
    let balanceJson = yield call(fetchApi.get, {url: urlApi.wallet.wallet + '/' + localStorage.account});
    let couponCountJson = yield call(fetchApi.get, {url: urlApi.coupon.total, search: {account: localStorage.account}});
    let invitationsJson = yield call(fetchApi.get, {url: urlApi.personal.invitations});
    if (statusCountJson.success && balanceJson.success && couponCountJson.success && invitationsJson.success) {
      yield put({
        type: GET_USER_MSG_SUCCESS,
        statusCount: statusCountJson.statusCount,
        balance: balanceJson.wallet.balance,
        couponCount: couponCountJson.total,
        invitations: invitationsJson.invitations
      })
    } else if (!statusCountJson.success) {
      yield [
        put({type: END_USER_MSG_CTRL}),
        put({type: ERROR, error: statusCountJson.msg})
      ]
    } else if (!balanceJson.success) {
      yield [
        put({type: END_USER_MSG_CTRL}),
        put({type: ERROR, error: balanceJson.msg})
      ]
    } else if (!couponCountJson.success) {
      yield [
        put({type: END_USER_MSG_CTRL}),
        put({type: ERROR, error: couponCountJson.msg})
      ]
    } else {
      yield [
        put({type: END_USER_MSG_CTRL}),
        put({type: ERROR, error: '网络异常，请检查网络'})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_USER_MSG_CTRL}),
      put({type: ERROR, error: '网络异常，请检查网络'})
    ]
  }
}

export function* watchGetUserMsg() {
  yield takeEvery(GET_USER_MSG, getUserMsg);
}