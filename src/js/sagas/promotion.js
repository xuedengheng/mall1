/**
 * Created by Ben on 2017/3/13.
 */
import {
    takeEvery,
} from 'redux-saga'
import {
    put,
    call,
} from 'redux-saga/effects'
import {fetchApi} from 'service'
import {
    PROMOTION_QUERY,
    SUCCESS_PROMOTION_QUERY,
    PROMOTION_CALCULATE,
    SUCCESS_PROMOTION_CALCULATE,
    PROMOTION_END,
    ERROR
} from 'actions/actionsTypes'

function* queryPromotion(action) {
    try {
        let result = yield call(fetchApi.postJson, action.params);
        if (result.success) {
            yield put({type: SUCCESS_PROMOTION_QUERY, result})
        } else {
            yield [
                put({type: PROMOTION_END}),
                put({type: ERROR, error: result.msg})
            ]
        }
    } catch (e) {
        yield [
                put({type: PROMOTION_END}),
                put({type: ERROR, error: "网络请求失败，请检查您的网络"})
            ]
    }
}

export function* watchQueryPromotion() {
    yield takeEvery(PROMOTION_QUERY, queryPromotion);
}

function* calculate(action) {
    try {
        let result = yield call(fetchApi.postJson, action.params);
        if (result.success) {
            yield put({type: SUCCESS_PROMOTION_CALCULATE, result})
        } else {
            yield [
                put({type: PROMOTION_END}),
                put({type: ERROR, error: result.msg})
            ]
        }
    } catch (e) {
        yield [
                put({type: PROMOTION_END}),
                put({type: ERROR, error: "网络请求失败，请检查您的网络"})
            ]
    }
}

export function* watchCalculate() {
    yield takeEvery(PROMOTION_CALCULATE, calculate);
}