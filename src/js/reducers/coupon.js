/**
 * Created by HEro on 2017/5/15.
 */
import {
  QUERY_COUPON,
  QUERY_COUPON_SUCCESS,
  INIT_COUPON,
  END_COUPON_CTRL,
  DELETE_COUPON,
} from '../actions/actionsTypes'

const init = {
  isFetching: false,
  visible: false,
  adopted: [],
  adoptedEmpty: false,
  used: [],
  usedEmpty: false,
  expired: [],
  expiredEmpty: false,
}

export default function coupon(state = init, action) {
  switch (action.type) {
    case QUERY_COUPON:
      return {
        ...state,
        isFetching: true
      }
    case QUERY_COUPON_SUCCESS:
      switch (action.status) {
        case 'ADOPTED':
          return {
            ...state,
            isFetching: false,
            adopted: action.coupons,
            adoptedEmpty: action.coupons.length === 0
          }
        case 'USED':
          return {
            ...state,
            isFetching: false,
            used: action.coupons,
            usedEmpty: action.coupons.length === 0
          }
        case 'EXPIRED':
          return {
            ...state,
            isFetching: false,
            expired: action.coupons,
            expiredEmpty: action.coupons.length === 0
          }
        default:
          return state
      }

    case INIT_COUPON:
      return {
        ...state,
        isFetching: false,
        couponList: [],
      }
    case DELETE_COUPON:
      return {
        ...state,
        isFetching: true
      }
    case END_COUPON_CTRL:
      return {
        ...state,
        isFetching: false
      }
    default :
      return state;
  }
}