/**
 * Created by Ben on 2016/12/28.
 */
import {
    takeEvery,
} from 'redux-saga'
import {
    put,
    call,
} from 'redux-saga/effects'
import {fetchApi, urlApi, Tool} from 'service'
import {
    SEARCH_FETCH,
    SEARCH_FETCH_SUCCESS,
    SEARCH_END,
    ERROR,
} from '../actions/actionsTypes'

function* getSearch(action) {
    try {
        let params = {url: urlApi.search.query + Tool.setSearchParams(action.params)};
        let result = yield call(fetchApi.get, params);
        if (result.success) {
            yield put({type: SEARCH_FETCH_SUCCESS, result: result.result})
        } else {
            yield [
                put({type: SEARCH_END}),
                put({type: ERROR, error: search.msg})
            ]
        }
    } catch (e) {
        yield [
            put({type: SEARCH_END}),
            put({type: ERROR, error: "网络请求失败，请检查您的网络"})
        ]
    }
}

export function* watchSearch() {
    yield takeEvery(SEARCH_FETCH, getSearch);
}