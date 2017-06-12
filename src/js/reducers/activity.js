/**
 * Created by Ben on 2017/5/5.
 */
import {
  GET_TIMELIMIT_LIST,
  GET_TIMELIMIT_LIST_SUCCESS,
  GET_TIMELIMIT_DETAIL,
  GET_TIMELIMIT_DETAIL_SUCCESS,
  INIT_ACTIVITY,
  END_ACTIVITY_CTRL
} from 'actions/actionsTypes'
import {checkoutTime, WILL} from 'service'

const init = {
  isFetching: false,
  now: null,
  ongoing: null,
  activeIndex: null,
  status: null,
  nextStart: null,
  timeLimitedList: [],
  timeLimitedDetail: [],
  start: '',
  end: ''
}

export default function activity(state = init, action) {
  switch (action.type) {
    case GET_TIMELIMIT_LIST:
      return {
        ...state,
        isFetching: true
      }
    case GET_TIMELIMIT_LIST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        timeLimitedList: action.payload
      }
    case GET_TIMELIMIT_DETAIL:
      return {
        ...state,
        isFetching: true,
        now: action.now,
        nextStart: action.nextStart,
        ongoing: action.ongoing ? action.ongoing : state.ongoing,
        activeIndex: action.activeIndex
      }
    case GET_TIMELIMIT_DETAIL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        timeLimitedDetail: action.payload,
        status: action.status,
        start: action.start,
        end: action.end
      }
    case INIT_ACTIVITY:
      return {
        ...state,
        isFetching: false,
        timeLimitedDetail: [],
      }
    case END_ACTIVITY_CTRL:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}