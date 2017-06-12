/**
 * Created by Ben on 2017/3/1.
 */
import {
  QUERY_DEFAULT,
  QUERY_DEFAULT_SUCCESS,
  QUERY_ADDRESS,
  QUERY_ADDRESS_SUCCESS,
  QUERY_ADDRESS_DETAIL,
  QUERY_ADDRESS_DETAIL_SUCCESS,
  EDIT_ADDRESS,
  EDIT_ADDRESS_SUCCESS,
  ADDRESS_END
} from 'actions/actionsTypes'

const init = {
  isFetching: false,
  default: [],
  addresses: [],
  detail: [],
}

export default function address(state = init, action) {
  switch (action.type) {
    case QUERY_DEFAULT:
      return {
        ...state,
        isFetching: true
      }
    case QUERY_DEFAULT_SUCCESS:
      return {
        ...state,
        isFetching: false,
        default: action.result,
      }
    case QUERY_ADDRESS:
      return {
        ...state,
        isFetching: true,
      }
    case QUERY_ADDRESS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        addresses: action.result,
      }
    case QUERY_ADDRESS_DETAIL:
      return {
        ...state,
        isFetching: true,
      }
    case QUERY_ADDRESS_DETAIL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        detail: action.result,
      }
    case EDIT_ADDRESS:
      return {
        ...state,
        isFetching: true
      }
    case EDIT_ADDRESS_SUCCESS:
      return {
        ...state,
        isFetching: false
      }
    case ADDRESS_END:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}