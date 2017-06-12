/**
 * Created by Ben on 2017/5/17.
 */
import {
  GET_PROMOTIONS,
  GET_PROMOTIONS_SUCCESS,
  CALCULATE_PROMOTIONS,
  CALCULATE_PROMOTIONS_SUCCESS,
  INIT_SUBMITORDER,
  SUBMIT_ORDER,
  SET_PAY_URL,
  SUBMITORDER_END,
  CLOSE_NOTVALID_MODAL
} from './actionsTypes'

export const getPromotions = orderSkuDTOs => ({
  type: GET_PROMOTIONS,
  orderSkuDTOs
})

export const getPromotionsSuccess = payload => ({
  type: GET_PROMOTIONS_SUCCESS,
  payload
})

export const calculatePromotions = (params, isFirst) => ({
  type: CALCULATE_PROMOTIONS,
  params,
  isFirst
})

export const calculatePromotionsSuccess = (orderSkuDTOs, promotionDiscountDTOs, totalAmount, totalFreight, totalPayAmount, isFirst) => ({
  type: CALCULATE_PROMOTIONS_SUCCESS,
  orderSkuDTOs,
  promotionDiscountDTOs,
  totalAmount,
  totalFreight,
  totalPayAmount,
  isFirst
})

export const submitOrder = (params, orderSkuDTOs, mode) => ({
  type: SUBMIT_ORDER,
  params,
  orderSkuDTOs,
  mode
})

export const setPayUrl = url => ({
  type: SET_PAY_URL,
  url
})

export const initSubmitOrder = () => ({
  type: INIT_SUBMITORDER
})

export const submitOrderEnd = (notValid) => ({
  type: SUBMITORDER_END,
  notValid
})

export const closeModal = (notValid) => ({
  type: CLOSE_NOTVALID_MODAL,
  notValid
})