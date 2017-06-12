/**
 * Created by Ben on 2017/3/27.
 */
import {
  CHOOSE_PAYWAY,
  GET_PAY_TOKEN,
  GET_YIWUCOIN,
  GET_YIWUCOIN_SUCCESS,
  END_GET_YW,
  PAY,
  QUERY_PAY_RESULT,
  QUERY_PAY_RESULT_SUCCESS,
  PAY_END
} from './actionsTypes'

export const choosePayWay = params => ({
  type: CHOOSE_PAYWAY,
  params
})

export const getYiwuCoin = () => ({
  type:GET_YIWUCOIN,
})

export const getYiwuCoinSuccess = ywCoin => ({
  type:GET_YIWUCOIN_SUCCESS,
  ywCoin
})

export const endGetYW = () => ({
  type:END_GET_YW,
})

export const getPayToken = () => ({
  type: GET_PAY_TOKEN
})

export const pay = (payWay, params) => ({
  type: PAY,
  payWay,
  params
})

export const queryPayResult = params => ({
  type: QUERY_PAY_RESULT,
  params
})

export const queryPayResultSuccess = result => ({
  type: QUERY_PAY_RESULT_SUCCESS,
  result
})

export const payEnd = () => ({
  type: PAY_END
})