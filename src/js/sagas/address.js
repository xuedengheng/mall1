/**
 * Created by Ben on 2017/3/1.
 */
import {
  takeEvery,
} from 'redux-saga'
import {
  put,
  call,
} from 'redux-saga/effects'
import history from 'service/history'
import {fetchApi} from 'service'
import {
  QUERY_DEFAULT,
  QUERY_DEFAULT_SUCCESS,
  QUERY_ADDRESS,
  QUERY_ADDRESS_SUCCESS,
  QUERY_ADDRESS_DETAIL,
  QUERY_ADDRESS_DETAIL_SUCCESS,
  EDIT_ADDRESS,
  EDIT_ADDRESS_SUCCESS,
  ADDRESS_END,
  ERROR
} from 'actions/actionsTypes'

function* getDefaultAddress(action) {
  try {
    let result = yield call(fetchApi.get, action.params);
    if (result.success) {
      yield put({type: QUERY_DEFAULT_SUCCESS, result})
    } else {
      yield [
        put({type: ADDRESS_END}),
        put({type: ERROR, error: result.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ADDRESS_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchDefaultAddress() {
  yield takeEvery(QUERY_DEFAULT, getDefaultAddress);
}

function* getAddresses(action) {
  try {
    let result = yield call(fetchApi.get, action.params);
    if (result.success) {
      yield put({type: QUERY_ADDRESS_SUCCESS, result})
    } else {
      yield [
        put({type: ADDRESS_END}),
        put({type: ERROR, error: result.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ADDRESS_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchAddresses() {
  yield takeEvery(QUERY_ADDRESS, getAddresses);
}

function* getDetail(action) {
  try {
    let result = yield call(fetchApi.get, action.params);
    if (result.success) {
      yield put({type: QUERY_ADDRESS_DETAIL_SUCCESS, result})
    } else {
      yield [
        put({type: ADDRESS_END}),
        put({type: ERROR, error: result.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ADDRESS_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchAddressDetail() {
  yield takeEvery(QUERY_ADDRESS_DETAIL, getDetail)
}

function* editAddress(action) {
  try {
    let result = yield call(fetchApi.post, action.params);
    if (result.success) {
      history.goBack();
      yield put({type: EDIT_ADDRESS_SUCCESS})
    } else {
      yield [
        put({type: ADDRESS_END}),
        put({type: ERROR, error: result.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ADDRESS_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchEditAddress() {
  yield takeEvery(EDIT_ADDRESS, editAddress)
}