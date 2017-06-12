/**
 * Created by Ben on 2017/1/11.
 */
import {
  takeEvery, delay
} from 'redux-saga'
import {
  put,
  call,
  fork,
  cancelled,
  cancel
} from 'redux-saga/effects'
import confidential from '../config/Confidential'
import {fetchApi, urlApi, Tool, getQueryString} from 'service'
import history from 'service/history'
import {
  LOGIN,
  LOGIN_SUCCESS,
  GET_VERIFICATION,
  GET_VERIFICATION_SUCCESS,
  REGISTER,
  RESET,
  STOP_ACCOUNT_LOADING,
  SAVE_REGISTER_PARAMS,
  SET_VC_TIMER,
  ACCOUNT_END,
  ERROR,
} from '../actions/actionsTypes'

function* login(action) {
  try {
    let result = yield call(fetchApi.post, action.params);
    if (result.success) {
      yield fork(setLoginValue, action.params, result);
      yield put({type: LOGIN_SUCCESS})
    } else {
      yield [
        put({type: ACCOUNT_END}),
        put({type: ERROR, error: result.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ACCOUNT_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

function* setLoginValue(params, data) {
  const {search} = history.location;
  const redirectUrl = getQueryString(search, 'redirectUrl');

  localStorage.setItem('account', params.search.account);
  localStorage.setItem('password', params.search.password);

  let userInfo = JSON.stringify(data.userInfo);
  localStorage.setItem('userInfo', userInfo);
  localStorage.setItem('userId', data.userInfo.userId);
  localStorage.setItem('token', data.token);
  if (redirectUrl) {
    window.location.href = redirectUrl + '?from=H5&mChannal=' + confidential.M_CHANNAL +
      '&account=' + localStorage.account + '&token=' + localStorage.token
  } else {
    history.goBack();
  }
}

export function* watchLogin() {
  yield takeEvery(LOGIN, login)
}

function* getVerification(action) {
  try {
    let params = {url: urlApi.auth.sms + Tool.setSearchParams({mobile: action.mobile, module: action.module})};
    let json = yield call(fetchApi.post, params);
    if (json.success) {
      yield [
        put({type: GET_VERIFICATION_SUCCESS, module: action.module}),
        put({type: ERROR, error: json.msg})
      ]
    } else {
      yield [
        put({type: ACCOUNT_END}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ACCOUNT_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchGetVerification() {
  yield takeEvery(GET_VERIFICATION, getVerification)
}

function* register(action) {
  try {
    const {account, password, verifyCode} = action;
    let params = {url: urlApi.auth.register + Tool.setSearchParams({account, password: btoa(password), verifyCode})};
    let json = yield call(fetchApi.post, params);
    if (json.success) {
      yield [
        put({type: ACCOUNT_END}),
        put({type: ERROR, error: '注册成功'})
      ];
      history.goBack();
    } else {
      yield [
        put({type: STOP_ACCOUNT_LOADING}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ACCOUNT_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchRegister() {
  yield takeEvery(REGISTER, register)
}

function* reset(action) {
  try {
    const {account, password, verifyCode} = action;
    let params = {url: urlApi.auth.reset + Tool.setSearchParams({account, password: btoa(password), verifyCode})};
    let json = yield call(fetchApi.post, params);
    if (json.success) {
      yield [
        put({type: ACCOUNT_END}),
        put({type: ERROR, error: '修改成功'})
      ];
      history.goBack();
    } else {
      yield [
        put({type: STOP_ACCOUNT_LOADING}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: ACCOUNT_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchReset() {
  yield takeEvery(RESET, reset)
}

function* setVcTimer(action) {
  if (action.params) {
    let vcTimer = action.params.vcTimer;
    if (vcTimer !== 60) {
      for (let i = 0; i < vcTimer; i++) {
        yield call(delay, 1000);
        yield put({type: SET_VC_TIMER, time: vcTimer - i - 1})
      }
      yield put({type: SET_VC_TIMER, time: 60});
    }
  }
}

export function* watchSaveRegisterParams() {
  yield takeEvery(SAVE_REGISTER_PARAMS, setVcTimer)
}