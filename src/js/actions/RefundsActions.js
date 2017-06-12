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
} from './actionsTypes'

export const getRefunds = () => ({
  type: GET_REFUNDS,
})

export const getRefundsSuccess = payload => ({
  type: GET_REFUNDS_SUCCESS,
  payload
})

export const queryApplyRefund = data => ({
  type: QUERY_APPLYREFUND,
  data
})

export const queryApplyRefundSuccess = () => ({
  type: QUERY_APPLYREFUND_SUCCESS,
})

export const queryRefundInfo = data => ({
  type: QUERY_REFUNDINFO,
  data
})

export const queryRefundInfoSuccess = () => ({
  type: QUERY_REFUNDINFO_SUCCESS,
})

export const queryJdReturn = data => ({
  type: QUERY_JD_RETURN,
  data
})


export const queryJdReturnSuccess = () => ({
  type: QUERY_JD_RETURN_SUCCESS,
})

export const getRefundDetail = data => ({
  type: GET_REFUND_DETAIL,
  data
})

export const getRefundDetailSuccess = payload => ({
  type: GET_REFUND_DETAIL_SUCCESS,
  payload
})

export const getRefundTrace = requestId => ({
  type: GET_REFUND_TRACE,
  requestId
})

export const getRefundTraceSuccess = payload => ({
  type: GET_REFUND_TRACE_SUCCESS,
  payload
})

export const endRefundsCtrl = () => ({
  type: END_REFUNDS_CTRL
})