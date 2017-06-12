/**
 * Created by HEro on 2017/5/15.
 */
import {
  QUERY_COUPON, QUERY_COUPON_SUCCESS, INIT_COUPON, END_COUPON_CTRL,DELETE_COUPON
} from './actionsTypes';

export const getCouponList = status => ({
  type: QUERY_COUPON,
  status
})

export const getCouponListSuccess = (coupon) => ({
  type: QUERY_COUPON_SUCCESS,
  coupon
})

export const initCoupon = () => ({
  type: INIT_COUPON
})

export const endCouponCtrl = () => ({
  type: END_COUPON_CTRL
})

export const deleteCoupon = (status,couponId) => ({
  type: DELETE_COUPON,
  status,
  couponId
})

