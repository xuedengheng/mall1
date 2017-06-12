/**
 * Created by Ben on 2017/3/27.
 */
import {
  takeEvery,
} from 'redux-saga'
import {
  put,
  call,
} from 'redux-saga/effects'
import {hashHistory} from 'react-router'
import {
  CHOOSE_PAYWAY,
  PAY,
  QUERY_PAY_RESULT,
  QUERY_PAY_RESULT_SUCCESS,
  GET_YIWUCOIN,
  GET_YIWUCOIN_SUCCESS,
  END_GET_YW,
  PAY_END,
  ERROR,
} from '../actions/actionsTypes'
import history from 'service/history'
import {urlApi, fetchApi, Tool, LocalUtil, Constant} from 'service'

function* getYiwuCoin() {
  try {
    let json = yield call(fetchApi.get, {url: urlApi.wallet.wallet + '/' + localStorage.account});
    if (json.success) {
      yield put({
        type: GET_YIWUCOIN_SUCCESS,
        ywCoin: json.wallet.balance,
      })
    } else {
      yield [
        put({type: END_GET_YW}),
        put({type: ERROR, error: '网络异常，请检查网络'})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_GET_YW}),
      put({type: ERROR, error: '网络异常，请检查网络'})
    ]
  }
}
export function* watchGetYiwuCoin() {
  yield takeEvery(GET_YIWUCOIN, getYiwuCoin)
}

function* choosePayWay(action) {
  try {
    const {payWay} = action.params;
    let payJson = yield call(fetchApi.get, {
      url: urlApi.checkout.choosePayWay + Tool.setSearchParams(action.params)
    });
    if (payJson.success) {
      let tokenJson = yield call(fetchApi.get, {url: urlApi.pay.getToken});
      if (tokenJson.success) {
        const {mobilePhone, orderJnId, orderDetail, orderDate, orderTime} = payJson.result;
        let params = {
          mobilePhone,
          orderDate,
          orderDetail,
          orderJnId,
          orderTime,
          unionPayFlag: Constant.UNION_PAY_FLAG,
          tradeType: Constant.TRADE_TYPE,
          token: tokenJson.token,
          openId: payWay === Constant.WAY_WX ? localStorage.openId : null,
          pageUrl: payWay === Constant.WAY_FM ? Constant.FEIMA_PAGE : null,
        }
        switch (payWay) {
          case Constant.WAY_WX:
            yield put({type: PAY, payWay, params: {url: urlApi.pay.weixinpay + Tool.setSearchParams(params)}});
            break;
          case Constant.WAY_FM:
            yield put({type: PAY, payWay, params: {url: urlApi.pay.feimapayjson, search: params}});
            break;
          case Constant.WAY_YW:
            yield put({type: PAY, payWay, params: {url: urlApi.pay.yiwupayjson, search: params}});
            break;
          default:
            yield put({type: ERROR, error: "网络请求失败，请检查您的网络"});
            break;
        }
      } else {
        yield [
          put({type: PAY_END}),
          put({type: ERROR, error: tokenJson.msg})
        ]
      }
    } else {
      yield [
        put({type: PAY_END}),
        put({type: ERROR, error: payJson.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: PAY_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchChoosePayWay() {
  yield takeEvery(CHOOSE_PAYWAY, choosePayWay)
}

function* pay(action) {
  try {
    let json = yield call(fetchApi.postJson, action.params);
    if (json.success) {
      const payload = json.result;
      const {orderJnId, payInfo} = payload;
      switch (action.payWay) {
        case Constant.WAY_WX:
          const {appid, timestamp, noncestr, sign, prepayid} = data.result.payInfo;
          let params = {
            appId: appid,
            timeStamp: timestamp,
            nonceStr: noncestr,
            package: `prepay_id=${prepayid}`,
            signType: 'MD5',
            paySign: sign
          };
          WeixinJSBridge.invoke(
            'getBrandWCPayRequest',
            params,
            function () {
              hashHistory.replace('/pay_result?orderJnId=' + orderJnId)
            }
          );
          break;
        case Constant.WAY_FM:
          if (payInfo.payUrl) {
            window.location.href = payInfo.payUrl
          } else {
            yield [
              put({type: PAY_END}),
              put({type: ERROR, error: "网络请求失败，请检查您的网络"})
            ]
          }
          break;
        case Constant.WAY_YW:
          hashHistory.replace('/pay_result?orderJnId=' + orderJnId)
          break;
        default:
          break;
      }
    } else {
      yield [
        put({type: PAY_END}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: PAY_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchPay() {
  yield takeEvery(PAY, pay)
}

function* queryPayResult(action) {
  try {
    let params = {
      url: urlApi.pay.queryPayResult,
      search: action.params
    }
    let result = yield call(fetchApi.get, params);
    if (result.success) {
      yield put({type: QUERY_PAY_RESULT_SUCCESS, result: result.result})
    } else {
      yield [
        put({type: PAY_END}),
        put({type: ERROR, error: result.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: PAY_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchQueryPayResult() {
  yield takeEvery(QUERY_PAY_RESULT, queryPayResult)
}