/**
 * Created by Ben on 2017/5/3.
 */
import {
  QUERY_ORDER_LIST,
  QUERY_ORDER_LIST_SUCCESS,
  QUERY_ORDER_DETAIL,
  QUERY_ORDER_DETAIL_SUCCESS,
  DELETE_ORDER,
  CANCEL_ORDER,
  EXTENDED_ORDER,
  CONFIRM_ORDER,
  QUERY_EXPRESS,
  QUERY_EXPRESS_SUCCESS,
  OPEN_CONFIRM_MODAL,
  CLOSE_CONFIRM_MODAL,
  CLEAR_ORDER_DETAIL,
  QUERY_NOWTIME,
  QUERY_NOWTIME_SUCCESS,
  ORDER_END,
  CLEAR_EXPRESS
} from './actionsTypes'

export const queryOrderList = (status, page) => ({
  type: QUERY_ORDER_LIST,
  status,
  page
});

export const queryOrderListSuccess = (result, status) => ({
  type: QUERY_ORDER_LIST_SUCCESS,
  result,
  status
})

export const queryOrderDetail = (orderId) => ({
  type: QUERY_ORDER_DETAIL,
  orderId
});

export const queryOrderDetailSuccess = (result, orderId, refundamount, time, deadtime, orderStatus, parcelstatus) => ({
  type: QUERY_ORDER_DETAIL_SUCCESS,
  orderId,
  result,
  time,
  deadtime,
  orderStatus,
  refundamount,
  parcelstatus,
})

export const clearOrderDetail = () => ({
  type: CLEAR_ORDER_DETAIL
})

export const deleteOrder = (status, page, orderId) => ({
  type: DELETE_ORDER,
  status,
  page,
  orderId
})

export const cancelOrder = (status, orderId, page) => ({
  type: CANCEL_ORDER,
  status,
  page,
  orderId,
})

export const extendedOrder = (orderId, parcelId) => ({
  type: EXTENDED_ORDER,
  orderId,
  parcelId
})

export const confirmOrder = (orderId, parcelId) => ({
  type: CONFIRM_ORDER,
  orderId,
  parcelId
})

export const queryExpress = (expressNum) => ({
  type: QUERY_EXPRESS,
  expressNum
})

export const queryExpressSuccess = (result, orderTrack) => ({
  type: QUERY_EXPRESS_SUCCESS,
  result,
  orderTrack
})

export const queryNowTime = () => ({
  type: QUERY_NOWTIME
})

export const queryNowTimeSuccess = (nowTime) => ({
  type: QUERY_NOWTIME_SUCCESS,
  nowTime
})

export const openConfirmModal = () => ({
  type: OPEN_CONFIRM_MODAL
})

export const closeConfirmModal = () => ({
  type: CLOSE_CONFIRM_MODAL
})

export const orderEnd = () => ({
  type: ORDER_END
})
export const clearExpress = () => ({
  type: CLEAR_EXPRESS
})