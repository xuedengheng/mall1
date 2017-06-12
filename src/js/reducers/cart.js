/**
 * Created by Ben on 2017/1/16.
 */
import {
  QUERY_CART,
  QUERY_CART_SUCCESS,
  ADD_CART,
  ADD_CART_SUCCESS,
  OPEN_CART_MODAL,
  OPEN_CART_MODAL_SUCCESS,
  CLOSE_CART_MODAL,
  UPDATE_CART,
  UPDATE_CART_SUCCESS,
  REMOVE_CART,
  REMOVE_CART_SUCCESS,
  CHECKOUT_ORDER,
  CANCEL_CHECK,
  INIT_CANCEL_CHECK,
  END_CART_OPERATION
} from 'actions/actionsTypes'

const init = {
  isFetching: false,
  visible: false,
  attributes: [],
  stocks: [],
  product: [],
  list: [],
  add: [],
  cancelCheck: false
}

export default function cart(state = init, action) {
  switch (action.type) {
    case QUERY_CART:
      return {
        ...state,
        isFetching: true,
      }
    case QUERY_CART_SUCCESS:
      return {
        ...state,
        isFetching: false,
        list: action.result,
      }
    case ADD_CART:
      return {
        ...state,
        isFetching: true
      }
    case ADD_CART_SUCCESS:
      return {
        ...state,
        isFetching: false,
      }
    case UPDATE_CART:
      return {
        ...state,
        isFetching: true
      }
    case UPDATE_CART_SUCCESS:
      return {
        ...state,
        isFetching: false
      }
    case REMOVE_CART:
      return {
        ...state,
        isFetching: true
      }
    case REMOVE_CART_SUCCESS:
      return {
        ...state,
        isFetching: false
      }
    case CHECKOUT_ORDER:
      return {
        ...state,
        isFetching: true
      }
    case OPEN_CART_MODAL:
      return {
        ...state,
        isFetching: true
      }
    case OPEN_CART_MODAL_SUCCESS:
      return {
        ...state,
        isFetching: false,
        visible: true,
        product: action.product,
        attributes: action.attributes,
        stocks: action.stocks
      }
    case CLOSE_CART_MODAL:
      return {
        ...state,
        visible: false,
      }
    case CANCEL_CHECK:
      return {
        ...state,
        cancelCheck: true
      }
    case INIT_CANCEL_CHECK:
      return {
        ...state,
        cancelCheck: false
      }
    case END_CART_OPERATION:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}