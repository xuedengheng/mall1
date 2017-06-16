/**
 * Created by Ben on 2017/5/17.
 */
import {takeEvery} from 'redux-saga'
import {put, call,} from 'redux-saga/effects'
import {hashHistory} from 'react-router'
import {fetchApi, urlApi} from 'service'
import {
  GET_PROMOTIONS,
  GET_PROMOTIONS_SUCCESS,
  CALCULATE_PROMOTIONS,
  CALCULATE_PROMOTIONS_SUCCESS,
  SUBMIT_ORDER,
  SET_PAY_URL,
  SUBMITORDER_END,
  ERROR
} from 'actions/actionsTypes'

const COUPON = 'COUPON';

function* getPromotion(action) {
  try {
    let params = {
      url: urlApi.promotion.query,
      search: {
        orderSkuDTOs: action.orderSkuDTOs,
        userMobile: localStorage.account
      }
    }
    let json = yield call(fetchApi.postJson, params);
    if (json.success) {
      let promotionDTOs = json.result.filter(promo => promo.type !== COUPON);
      yield [
        put({type: GET_PROMOTIONS_SUCCESS, payload: json.result}),
        put({
          type: CALCULATE_PROMOTIONS,
          isFirst: true,
          params: {
            orderSkuDTOs: action.orderSkuDTOs,
            promotionDTOs
          }
        })
      ]
    } else {
      yield [
        put({type: SUBMITORDER_END}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: SUBMITORDER_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchGetPromotion() {
  yield takeEvery(GET_PROMOTIONS, getPromotion)
}

function* calculate(action) {
  try {
    let params = {
      url: urlApi.promotion.calculate,
      search: action.params
    }
    let json = yield call(fetchApi.postJson, params);
    if (json.success) {
      const {orderSkuDTOs, promotionDiscountDTOs, totalAmount, totalFreight, totalPayAmount} = json.result;
      yield put({
        type: CALCULATE_PROMOTIONS_SUCCESS,
        orderSkuDTOs,
        promotionDiscountDTOs,
        totalAmount,
        totalFreight,
        totalPayAmount,
        isFirst: action.isFirst
      })
    } else {
      yield [
        put({type: SUBMITORDER_END}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: SUBMITORDER_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchCalculate() {
  yield takeEvery(CALCULATE_PROMOTIONS, calculate)
}

function* submitOrder(action) {
  try {
    let json = yield call(fetchApi.postJson, action.params);
    if (json.success) {
      let url = `/pay_order/${JSON.stringify(json.result)}?mode=${action.mode}${action.mode === 'immediately' ? '&id=' + json.result.orderDetail[0].orderId : ''}`;
      // yield put({type: SET_PAY_URL, url});
      hashHistory.replace(url);
    } else {
      yield put({type: SUBMITORDER_END});
      console.log(json.msg, json.code);
      switch (json.code) {
        case 8015:
          yield put({type: ERROR, error: json.msg});
          setTimeout(function () {
            hashHistory.goBack();
          }, 1000);
          break;
        case 11122:
          yield [
            put({type: ERROR, error: json.msg}),
            put({type: GET_PROMOTIONS, orderSkuDTOs: action.orderSkuDTOs})
          ];
          break;
        case 12003:
          yield [
            put({type: ERROR, error: json.msg}),
            put({type: GET_PROMOTIONS, orderSkuDTOs: action.orderSkuDTOs})
          ];
          break;
        default:
          yield put({type: ERROR, error: json.msg})
      }

    }
  } catch (e) {
    yield [
      put({type: SUBMITORDER_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchSubmitOrder() {
  yield takeEvery(SUBMIT_ORDER, submitOrder)
}