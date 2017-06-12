/**
 * Created by Ben on 2017/5/17.
 */
import {
  GET_PROMOTIONS,
  GET_PROMOTIONS_SUCCESS,
  CALCULATE_PROMOTIONS,
  CALCULATE_PROMOTIONS_SUCCESS,
  INIT_SUBMITORDER,
  SET_PAY_URL,
  SUBMIT_ORDER,
  SUBMITORDER_END,
  CLOSE_NOTVALID_MODAL
} from 'actions/actionsTypes'

const init = {
  isFetching: false,
  orderSkuDTOs: null,
  queryPromotions: [],
  promotionDiscountDTOs: [],
  postPromotions: [],
  selectedCoupon: null,
  quantity: 0,
  totalAmount: 0,
  totalFreight: 0,
  totalPayAmount: 0,
  notValid: [],
  payUrl: null
}

export default function submitOrder(state = init, action) {
  switch (action.type) {
    case GET_PROMOTIONS:
      return {
        ...state,
        isFetching: true
      }
    case GET_PROMOTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        queryPromotions: action.payload
      }
    case CALCULATE_PROMOTIONS:
      return {
        ...state,
        isFetching: true,
        postPromotions: action.params.promotionDTOs
      }
    case CALCULATE_PROMOTIONS_SUCCESS:
      return {
        ...state,
        isFetching: false,
        orderSkuDTOs: action.orderSkuDTOs,
        promotionDiscountDTOs: action.isFirst ? action.promotionDiscountDTOs : state.promotionDiscountDTOs,
        totalAmount: action.totalAmount,
        totalFreight: action.totalFreight,
        totalPayAmount: action.totalPayAmount,
        quantity: action.isFirst ? action.orderSkuDTOs.reduce((orderAcc, order) => {
            return orderAcc + order.skuPrices.reduce((skuAcc, sku) => {
                return skuAcc + Number(sku.quantity)
              }, 0)
          }, 0) : state.quantity
      }
    case SUBMIT_ORDER:
      return {
        ...state,
        isFetching: true
      }
    case SET_PAY_URL:
      return {
        ...state,
        payUrl: action.url
      }
    case INIT_SUBMITORDER:
      return {
        ...state,
        orderSkuDTOs: null
      }
    case SUBMITORDER_END:
      return {
        ...state,
        isFetching: false,
        notValid: action.notValid
      }
    case CLOSE_NOTVALID_MODAL:
      return {
        ...state,
        isFetching: false,
        notValid: []
      }
    default:
      return state
  }
}