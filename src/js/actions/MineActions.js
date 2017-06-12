/**
 * Created by Ben on 2017/4/26.
 */
import {GET_USER_MSG, GET_USER_MSG_SUCCESS, END_USER_MSG_CTRL} from './actionsTypes'

export const getUserMsg = () => ({
  type: GET_USER_MSG
})

export const getUserMsgSuccess = (statusCount, balance, couponCount) => ({
  type: GET_USER_MSG_SUCCESS,
  statusCount,
  balance,
  couponCount
})

export const endUserMsgCtrl = () => ({
  type: END_USER_MSG_CTRL
})