/**
 * Created by Ben on 2017/1/11.
 */
import {
  LOGIN,
  LOGIN_SUCCESS,
  GET_VERIFICATION,
  GET_VERIFICATION_SUCCESS,
  REGISTER,
  RESET,
  SAVE_REGISTER_PARAMS,
  SET_VC_TIMER,
  STOP_ACCOUNT_LOADING,
  ACCOUNT_END
} from './actionsTypes'

export const login = params => ({
  type: LOGIN,
  params
})

export const loginSuccess = result => ({
  type: LOGIN_SUCCESS,
  result
})

export const getVerification = (module, mobile) => ({
  type: GET_VERIFICATION,
  module,
  mobile
})

export const getVerificationSuccess = module => ({
  type: GET_VERIFICATION_SUCCESS,
  module
})

export const register = (account, password, verifyCode) => ({
  type: REGISTER,
  account,
  password,
  verifyCode
})

export const reset = (account, password, verifyCode) => ({
  type: RESET,
  account,
  password,
  verifyCode
})

export const saveRegisterData = params => ({
  type: SAVE_REGISTER_PARAMS,
  params
})

export const setVcTimer = time => ({
  type: SET_VC_TIMER,
  time
})

export const stopAccountLoading = () => ({
  type: STOP_ACCOUNT_LOADING
})

export const accountEnd = () => ({
  type: ACCOUNT_END
})
