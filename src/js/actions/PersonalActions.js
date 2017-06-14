/**
 * Created by HEro on 2017/5/22.
 */
import {
  QUERY_PERSONAL,
  QUERY_PERSONAL_SUCCESS,
  END_PERSONAL_CTRL
} from './actionsTypes'

export const queryPersonal = data => ({
  type: QUERY_PERSONAL,
  data
})
export const queryPersonalSuccess = (sex) => ({
  type: QUERY_PERSONAL_SUCCESS
})

export const endPersonal = () => ({
  type: END_PERSONAL_CTRL
})