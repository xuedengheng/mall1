/**
 * Created by Ben on 2017/3/27.
 */
import {
  QUERY_ORDER_LIST,
  QUERY_ORDER_LIST_SUCCESS,
  QUERY_ORDER_DETAIL,
  QUERY_ORDER_DETAIL_SUCCESS,
  DELETE_ORDER,
  EXTENDED_ORDER,
  CANCEL_ORDER,
  CONFIRM_ORDER,
  QUERY_EXPRESS,
  QUERY_EXPRESS_SUCCESS,
  CLEAR_EXPRESS,
  QUERY_NOWTIME,
  QUERY_NOWTIME_SUCCESS,
  OPEN_CONFIRM_MODAL,
  CLOSE_CONFIRM_MODAL,
  CLEAR_ORDER_DETAIL,
  ORDER_END
} from 'actions/actionsTypes'
import {OrderStatus} from 'service'

const init = {
  isFetching: false,
  orderId: [],
  visible: false,
  all: [],
  allEmpty: false,
  unpay: [],
  unpayEmpty: false,
  unallocated: [],
  unallocatedEmpty: false,
  unsend: [],
  unsendEmpty: false,
  untake: [],
  untakeEmpty: false,
  palceldetail: [],
  time: null,
  deadtime: [],
  orderStatus: null,
  expressDetail: [],
  jdOrderId: [],
  orderTrack: [],
  refundamount: null,
  parcelstatus: [],
}

export default function orders(state = init, action) {
  switch (action.type) {
    case QUERY_ORDER_LIST:
      return {
        ...state,
        isFetching: true
      }
    case QUERY_ORDER_LIST_SUCCESS:
      switch (action.status) {
        case OrderStatus.all:
          return {
            ...state,
            isFetching: false,
            all: action.result,
            allEmpty: action.result.length === 0,
            indentStatus: action.status
          }
        case OrderStatus.unpay:
          return {
            ...state,
            isFetching: false,
            unpay: action.result,
            unpayEmpty: action.result.length === 0,
            indentStatus: action.status
          }
        case OrderStatus.unallocated:
          return {
            ...state,
            isFetching: false,
            unallocated: action.result,
            unallocatedEmpty: action.result.length === 0,
            indentStatus: action.status
          }
        case OrderStatus.unsend:
          return {
            ...state,
            isFetching: false,
            unsend: action.result,
            unsendEmpty: action.result.length === 0,
            indentStatus: action.status
          }
        case OrderStatus.untake:
          return {
            ...state,
            isFetching: false,
            untake: action.result,
            untakeEmpty: action.result.length === 0,
            indentStatus: action.status
          }
        default:
          return state
      }
    case QUERY_ORDER_DETAIL:
      return {
        ...state,
        isFetching: true
      }
    case QUERY_ORDER_DETAIL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        orderId: action.orderId,
        palceldetail: action.result,
        time: action.time,
        deadtime: action.deadtime,
        parcelstatus: action.parcelstatus,
        orderStatus: action.orderStatus,
        refundamount: action.refundamount,
      }
    case CLEAR_ORDER_DETAIL:
      return {
        ...state,
        palceldetail: [],
        time: null,
        deadtime: [],
        orderStatus: null,
      }
    case QUERY_EXPRESS:
      return {
        ...state,
        isFetching: true
      }
    case QUERY_EXPRESS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        orderTrack: action.orderTrack.reverse(),
      }
    case CLEAR_EXPRESS:
      return {
        ...state,
        isFetching: false,
        orderTrack:[],
        jdOrderId:null
      }
    case QUERY_NOWTIME:
      return {
        ...state,
        isFetching: false
      }
    case QUERY_NOWTIME_SUCCESS:
      return {
        ...state,
        isFetching: false,
        nowTime: action.nowTime
      }
    case DELETE_ORDER:
      return {
        ...state,
        isFetching: true
      }
    case CANCEL_ORDER:
      return {
        ...state,
        isFetching: true
      }
    case EXTENDED_ORDER:
      return {
        ...state,
        isFetching: true
      }
    case CONFIRM_ORDER:
      return {
        ...state,
        isFetching: true
      }
    case OPEN_CONFIRM_MODAL:
      return {
        ...state,
        visible: true
      }
    case CLOSE_CONFIRM_MODAL:
      return {
        ...state,
        visible: false
      }
    case ORDER_END:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}