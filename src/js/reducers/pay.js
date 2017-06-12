/**
 * Created by Ben on 2017/3/27.
 */
import {
  CHOOSE_PAYWAY,
  GET_PAY_TOKEN,
  PAY,
  QUERY_PAY_RESULT,
  QUERY_PAY_RESULT_SUCCESS,
  GET_YIWUCOIN,
  GET_YIWUCOIN_SUCCESS,
  END_GET_YW,
  PAY_END
} from 'actions/actionsTypes'

const init = {
  isFetching: false,
  result: {},
  ywCoin: '',
}

export default function pay(state = init, action) {
  switch (action.type) {
    case CHOOSE_PAYWAY:
      return {
        ...state,
        isFetching: true
      }
    case GET_YIWUCOIN:
      return {
        ...state
      }
    case GET_YIWUCOIN_SUCCESS:
      return {
        ...state,
        ywCoin: action.ywCoin
      }
    case END_GET_YW:
      return {
        ...state
      }
    case GET_PAY_TOKEN:
      return {
        ...state
      }
    case PAY:
      return {
        ...state
      }
    case QUERY_PAY_RESULT:
      return {
        ...state,
        isFetching: true
      }
    case QUERY_PAY_RESULT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        result: action.result
      }
    case PAY_END:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}