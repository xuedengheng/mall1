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
} from 'actions/actionsTypes'

const init = {
  isFetching: false,
  login: false,
  isGetVerification: false,
  registerParams: null
}

export default function account(state = init, action) {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isFetching: true
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isFetching: false,
        login: true
      }
    case GET_VERIFICATION:
      return {
        ...state,
        isFetching: true
      }
    case GET_VERIFICATION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        isGetVerification: true
      }
    case REGISTER:
      return {
        ...state,
        isFetching: true
      }
    case RESET:
      return {
        ...state,
        isFetching: true
      }
    case STOP_ACCOUNT_LOADING:
      return {
        ...state,
        isFetching: false
      }
    case ACCOUNT_END:
      return {
        ...state,
        isFetching: false,
        login: false,
        isGetVerification: false,
        registerParams: null
      }
    case SET_VC_TIMER:
      return {
        ...state,
        registerParams: {
          ...state.registerParams,
          vcTimer: action.time
        }
      }
    case SAVE_REGISTER_PARAMS:
      return {
        ...state,
        registerParams: action.params
      }
    default:
      return state
  }
}