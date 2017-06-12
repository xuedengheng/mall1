/**
 * Created by Ben on 2017/4/19.
 */
import {
  GET_REFUNDS,
  GET_REFUNDS_SUCCESS,
  GET_REFUND_DETAIL,
  GET_REFUND_DETAIL_SUCCESS,
  GET_REFUND_TRACE,
  GET_REFUND_TRACE_SUCCESS,
  QUERY_APPLYREFUND,
  QUERY_APPLYREFUND_SUCCESS,
  QUERY_REFUNDINFO,
  QUERY_REFUNDINFO_SUCCESS,
  QUERY_JD_RETURN,
  QUERY_JD_RETURN_SUCCESS,
  END_REFUNDS_CTRL
} from 'actions/actionsTypes'

const init = {
  isFetching: false,
  empty: false,
  list: [],
  detail: {},
  trace: []
}

export default function refunds(state = init, action) {
  switch (action.type) {
    case GET_REFUNDS:
      return {
        ...state,
        isFetching: true
      }
    case GET_REFUNDS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        empty: action.payload.length === 0,
        list: action.payload
      }
    case GET_REFUND_DETAIL:
      return {
        ...state,
        isFetching: true
      }
    case GET_REFUND_DETAIL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        detail: action.payload
      }
    case GET_REFUND_TRACE:
      return {
        ...state,
        isFetching: true
      }
    case GET_REFUND_TRACE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        trace: action.payload
      }
    case QUERY_APPLYREFUND:
      return {
        ...state,
        isFetching: true
      }
    case QUERY_APPLYREFUND_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    case QUERY_JD_RETURN:
      return {
        ...state,
        isFetching: true
      }
    case QUERY_JD_RETURN_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    case QUERY_REFUNDINFO:
      return {
        ...state,
        isFetching: true
      }
    case QUERY_REFUNDINFO_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    case END_REFUNDS_CTRL:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}