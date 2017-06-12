/**
 * Created by HEro on 2017/5/22.
 */
import {put, call} from 'redux-saga/effects'
import {takeEvery} from 'redux-saga'
import {fetchApi, urlApi, Constant} from 'service'
import history from 'service/history';
import {
  QUERY_PERSONAL,
  QUERY_PERSONAL_SUCCESS,
  END_PERSONAL_CTRL,
  ERROR
} from '../actions/actionsTypes'

export function* editPersonal(action) {
  try {
    let search = {
      account: localStorage.account,
      sex: action.data.sex ? action.data.sex : null,
      nickName: action.data.nickName ? action.data.nickName : null,
      avatar: action.data.avatar ? action.data.avatar : null,
      province: action.data.province ? action.data.province : null,
      city: action.data.city ? action.data.city : null
    }
    let params = {url: urlApi.userinfo.update, search: search}
    let json = yield call(fetchApi.post, params);
    if (json.success) {
      let userInfo = JSON.stringify(json.userInfo);
      localStorage.setItem('userInfo', userInfo);
      yield[put({type: QUERY_PERSONAL_SUCCESS})]
      if (action.data.nickName) {
        history.goBack();
      }
    } else {
      yield[
        put({type: END_PERSONAL_CTRL}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_PERSONAL_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}
export function* watchEditPersonal() {
  yield takeEvery(QUERY_PERSONAL, editPersonal);
}

