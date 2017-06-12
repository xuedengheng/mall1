/**
 * Created by Ben on 2017/1/4.
 */
import {
    takeEvery,
} from 'redux-saga'
import {
    put,
    call,
} from 'redux-saga/effects'
import { fetchApi } from 'service'
import {
    CATELOG_FETCH,
    CATELOG_FETCH_SUCCESS,
    CATELOG_END,
    ERROR,
} from '../actions/actionsTypes'

function* getCatelog(action) {
    try {
        let catelog = yield call(fetchApi.get, action.params)
        if (catelog.success) {
            yield put({type: CATELOG_FETCH_SUCCESS, catelog})
        } else {
            yield [
                put({type: CATELOG_END}),
                put({type: ERROR, error: catelog.msg})
            ]
        }
    } catch (e) {
        yield [
                put({type: CATELOG_END}),
                put({type: ERROR, error: "网络请求失败，请检查您的网络"})
            ]
    }
}

export function* watchCatelog() {
    yield takeEvery(CATELOG_FETCH, getCatelog);
}