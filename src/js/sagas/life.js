/**
 * Created by Ben on 2017/1/13.
 */
import {takeEvery} from 'redux-saga'
import {put, call} from 'redux-saga/effects'
import {fetchApi} from 'service'
import {
    FETCH_LIFE,
    FETCH_LIFE_SUCCESS,
    FETCH_ARTICLE,
    FETCH_ARTICLE_SUCCESS,
    LIFE_END,
    ADD_ID,
    SAVE_ID,
    ERROR,
} from '../actions/actionsTypes'

function* getLife(action) {
    try {
        let result = yield call(fetchApi.get, action.params)
        if (result.success) {
            yield put({type: FETCH_LIFE_SUCCESS, result})
        } else {
            yield [
                put({type: LIFE_END}),
                put({type: ERROR, error: result.msg})
            ]
        }
    } catch (e) {
        yield [
            put({type: LIFE_END}),
            put({type: ERROR, error: "网络请求失败，请检查您的网络"})
        ]
    }
}

export function* watchLife() {
    yield takeEvery(FETCH_LIFE, getLife);
}

function* getArticle(action) {
    try {
        let result = yield call(fetchApi.get, action.params)
        if (result.success) {
            yield put({type: FETCH_ARTICLE_SUCCESS, result})
        } else {
            yield [
                put({type: LIFE_END}),
                put({type: ERROR, error: result.msg})
            ]
        }
    } catch (e) {
        yield [
            put({type: LIFE_END}),
            put({type: ERROR, error: "网络请求失败，请检查您的网络"})
        ]
    }
}

export function* watchArticle() {
    yield takeEvery(FETCH_ARTICLE, getArticle);
}

function* addId(action) {
    let id = action.id;
    yield put({type: SAVE_ID, id})
}

export function* watchAddId() {
    yield takeEvery(ADD_ID, addId)
}