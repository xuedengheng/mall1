/**
 * Created by HEro on 2017/5/22.
 */
import {
  QUERY_PERSONAL,
  QUERY_PERSONAL_SUCCESS,
  END_PERSONAL_CTRL,
} from '../actions/actionsTypes'

const init = {
  isFetching: false,
  sex:''
}

export default function queryPersonal(state = init, action) {
  switch (action.type) {
    case QUERY_PERSONAL:
      return {
        ...state,
        isFetching: false
      }
    case QUERY_PERSONAL_SUCCESS:
      return {
        ...state,
        isFetching: false
      }
    case END_PERSONAL_CTRL:
      return {
        ...state,
        isFetching: false,
      }
    default:
      return state
  }
}