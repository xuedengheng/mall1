/**
 * Created by Ben on 2017/3/1.
 */
import {takeEvery} from 'redux-saga'
import {put, call,} from 'redux-saga/effects'
import {fetchApi, urlApi} from 'service'
import {
  QUERY_CARD,
  QUERY_CARD_SUCCESS,
  QUERY_CARD_DETAIL,
  QUERY_CARD_DETAIL_SUCCESS,
  EWUCARD_END,
  ERROR,
} from '../actions/actionsTypes'

function* queryCard() {
  try {
    let purchased = yield call(fetchApi.get, {url: `${urlApi.card.query}/Purchased/purchasedBy/${localStorage.account}/0/10`});
    let applied = yield call(fetchApi.get, {url: `${urlApi.card.query}/Applied/purchasedBy/${localStorage.account}/0/10`});
    if (purchased.success && applied.success) {
      yield put({
        type: QUERY_CARD_SUCCESS,
        purchased: purchased.cards,
        applied: applied.cards,
      })
    } else if (!purchased.success) {
      yield [
        put({type: EWUCARD_END}),
        put({type: ERROR, error: purchased.msg})
      ]
    } else if (!applied.success) {
      yield [
        put({type: EWUCARD_END}),
        put({type: ERROR, error: applied.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: EWUCARD_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchQueryCard() {
  yield takeEvery(QUERY_CARD, queryCard)
}

function* getCardDetail(action) {
  try {
    let params = {url: `${urlApi.card.detai}/${action.params}`};
    let result = yield call(fetchApi.get, params)
    if (result.success) {
      yield put({type: QUERY_CARD_DETAIL_SUCCESS, result: result.card})
    } else {
      yield [
        put({type: EWUCARD_END}),
        put({type: ERROR, error: result.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: EWUCARD_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchCardDetail() {
  yield takeEvery(QUERY_CARD_DETAIL, getCardDetail)
}