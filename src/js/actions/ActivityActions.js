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
} from './actionsTypes'

export const getTimelimitList = mchannal => ({
  type: GET_TIMELIMIT_LIST,
  mchannal
})

export const getTimelimitListSuccess = payload => ({
  type: GET_TIMELIMIT_LIST_SUCCESS,
  payload
})

export const getTimelimitDetail = (id, now, status, activeIndex, nextStart, ongoing, mchannal) => ({
  type: GET_TIMELIMIT_DETAIL,
  id,
  now,
  status,
  nextStart,
  activeIndex,
  mchannal
})

export const getTimelimitDetailSuccess = (payload,status, start, end) => ({
  type: GET_TIMELIMIT_DETAIL_SUCCESS,
  payload,
  start,
  end
})

export const initActivity = () => ({
  type: INIT_ACTIVITY
})

export const endActivityCtrl = () => ({
  type: END_ACTIVITY_CTRL
})