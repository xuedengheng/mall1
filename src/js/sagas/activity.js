/**
 * Created by Ben on 2017/5/5.
 */
import {takeEvery} from 'redux-saga'
import {put, call, fork} from 'redux-saga/effects'
import _ from 'lodash'
import {fetchApi, urlApi, Constant} from 'service'
import {
  GET_TIMELIMIT_LIST,
  GET_TIMELIMIT_LIST_SUCCESS,
  GET_TIMELIMIT_DETAIL,
  GET_TIMELIMIT_DETAIL_SUCCESS,
  END_ACTIVITY_CTRL,
  ERROR
} from 'actions/actionsTypes'

function* getTimeLimitedList(action) {
  try {
    let json = yield call(fetchApi.get, {url: urlApi.activity.timeLimitedList}, action.mchannal ? action.mchannal : null);
    if (json.success) {
      let payload = json.activities;
      yield [
        put({type: GET_TIMELIMIT_LIST_SUCCESS, payload}),
        fork(getFirstLimitedDetail, payload, action.mchannal ? action.mchannal : null)
      ]
    } else {
      yield [
        put({type: END_ACTIVITY_CTRL}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_ACTIVITY_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

function* getFirstLimitedDetail(payload, mchannal) {
  try {
    if (payload.length > 0) {
      let {result: now} = yield call(fetchApi.get, {url: urlApi.system.now});
      let nowDate = new Date(now.replace(/-/g, '/')).getTime();
      let index = _.findLastIndex(payload, ({start, end}) => {
        let startDate = new Date(start.replace(/-/g, '/')).getTime();
        let endDate = new Date(end.replace(/-/g, '/')).getTime();
        return startDate < nowDate && endDate > nowDate
      })
      if (index !== -1) {
        let id = payload[index].id;
        yield put({
          type: GET_TIMELIMIT_DETAIL,
          id,
          now,
          status: Constant.ING,
          nextStart: payload[index + 1] ? payload[index + 1].start : null,
          ongoing: index,
          activeIndex: index,
          mchannal: mchannal ? mchannal : null
        })
      } else {
        let id = payload[0].id;
        yield put({
          type: GET_TIMELIMIT_DETAIL,
          id,
          now,
          status: Constant.WILL,
          ongoing: -1,
          activeIndex: 0,
          mchannal: mchannal ? mchannal : null})
      }
    } else {
      yield put({type: ERROR, error: "暂无活动！"})
    }
  } catch (e) {
    yield put({type: ERROR, error: "网络请求失败，请检查您的网络"})
  }
}

export function* watchGetTimeLimitList() {
  yield takeEvery(GET_TIMELIMIT_LIST, getTimeLimitedList)
}

function* getTimeLimitedDetail(action) {
  try {
    let json = yield call(fetchApi.get, {url: urlApi.activity.timeLimitedDetail + '/' + action.id}, action.mchannal ? action.mchannal : null);
    if (json.success) {
      let payload = json.activities[0];
      yield put({
        type: GET_TIMELIMIT_DETAIL_SUCCESS,
        payload,
        status: action.status,
        start: action.now,
        end: action.status === Constant.WILL ? payload.start : payload.end
      })
    } else {
      yield [
        put({type: END_ACTIVITY_CTRL}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_ACTIVITY_CTRL}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchGetTimeLimitedDetail() {
  yield takeEvery(GET_TIMELIMIT_DETAIL, getTimeLimitedDetail)
}