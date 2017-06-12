/**
 * Created by Ben on 2017/3/1.
 */
import {
  QUERY_ADDRESS,
  QUERY_ADDRESS_SUCCESS,
  QUERY_ADDRESS_DETAIL,
  QUERY_ADDRESS_DETAIL_SUCCESS,
  QUERY_DEFAULT,
  QUERY_DEFAULT_SUCCESS,
  EDIT_ADDRESS,
  EDIT_ADDRESS_SUCCESS,
  ADDRESS_END
} from './actionsTypes'

export const queryDefault = params => ({
  type: QUERY_DEFAULT,
  params
})

export const queryDefaultSuccess = result => ({
  type: QUERY_DEFAULT_SUCCESS,
  result
})

export const queryAddress = params => ({
  type: QUERY_ADDRESS,
  params
})

export const queryAddressSuccess = result => ({
  type: QUERY_ADDRESS_SUCCESS,
  result
})

export const queryAddressDetail = params => ({
  type: QUERY_ADDRESS_DETAIL,
  params
})

export const editAddress = params => ({
  type: EDIT_ADDRESS,
  params
})

export const editAddressSuccess = () => ({
  type:EDIT_ADDRESS_SUCCESS
})

export const queryAddressDetailSuccess = result => ({
  type: QUERY_ADDRESS_DETAIL_SUCCESS,
  result
})

export const addressEnd = () => ({
  type: ADDRESS_END
})
