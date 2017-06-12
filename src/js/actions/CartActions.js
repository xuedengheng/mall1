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
} from './actionsTypes'

export const queryCart = () => ({
  type: QUERY_CART,
})

export const queryCartSuccess = cart => ({
  type: QUERY_CART_SUCCESS,
  cart
})

export const addCart = (params, closeProductModal, productId) => ({
  type: ADD_CART,
  params,
  closeProductModal,
  productId
})

export const addCartSuccess = result => ({
  type: ADD_CART_SUCCESS,
  result
})

export const updateCart = params => ({
  type: UPDATE_CART,
  params
})

export const updateCartSuccess = payload => ({
  type: UPDATE_CART_SUCCESS,
  payload
})

export const removeCart = params => ({
  type: REMOVE_CART,
  params
})

export const removeCartSuccess = payload => ({
  type: REMOVE_CART_SUCCESS,
  payload
})

export const checkoutOrder = (params, preOrderCarts) => ({
  type: CHECKOUT_ORDER,
  params,
  preOrderCarts
})

export const openCartModal = params => ({
  type: OPEN_CART_MODAL,
  params
})

export const openCartModalSuccess = result => ({
  type: OPEN_CART_MODAL_SUCCESS,
  result
})

export const closeCartModal = () => ({
  type: CLOSE_CART_MODAL
})

export const cancelCheck = () => ({
  type: CANCEL_CHECK
})

export const initCancelCheck = () => ({
  type: INIT_CANCEL_CHECK
})

export const endCartOperation = () => ({
  type: END_CART_OPERATION
})