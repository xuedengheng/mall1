/**
 * Created by Ben on 2017/4/26.
 */
import {GET_USER_MSG, GET_USER_MSG_SUCCESS, END_USER_MSG_CTRL} from 'actions/actionsTypes'

const init = {
  isFetching: false,
  statusCount: [],
  balance: 0,
  couponCount:0,
  invitations: []
}

export default function mine(state = init, action) {
  switch (action.type) {
    case GET_USER_MSG:
      return {
        ...state,
        isFetching: true,
      }
    case GET_USER_MSG_SUCCESS:
      return {
        ...state,
        isFetching: false,
        statusCount: action.statusCount,
        balance: action.balance,
        couponCount:action.couponCount,
        invitations: action.invitations
      }
    case END_USER_MSG_CTRL:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}