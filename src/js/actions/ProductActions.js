/**
 * Created by Ben on 2016/12/15.
 */
import {
  PRODUCT_FETCH,
  PRODUCT_FETCH_SUCCESS,
  RICHDETAIL_FETCH,
  RICHDETAIL_FETCH_SUCCESS,
  FETCH_PRODUCT_INTREST,
  FETCH_PRODUCT_INTREST_SUCCESS,
  SET_ACTIVEKEY,
  TOGGLE_PRODUCT_MODAL,
  INIT_PRODUCT,
  CHECKOUT_PRODUCT,
  PRODUCT_END
} from './actionsTypes'

export const fetchProduct = (productId) => ({
  type: PRODUCT_FETCH,
  productId
});
export const successProduct = (product) => ({
  type: PRODUCT_FETCH_SUCCESS,
  product
});

export const fetchRichDetail = (params) => ({
  type: RICHDETAIL_FETCH,
  params
})
export const successRichDetail = (richDetail) => ({
  type: RICHDETAIL_FETCH_SUCCESS,
  richDetail
})

export const fetchProductSearch = (params, productId) => ({
  type: FETCH_PRODUCT_INTREST,
  params,
  productId
})

export const fetchProductSearchSuccess = (payload) => ({
  type: FETCH_PRODUCT_INTREST_SUCCESS,
  payload
})

export const setActiveKey = key => ({
  type: SET_ACTIVEKEY,
  key
})

export const toggleProductModal = (status, showType) => ({
  type: TOGGLE_PRODUCT_MODAL,
  status,
  showType
})

export const checkoutProduct = params => ({
  type: CHECKOUT_PRODUCT,
  params
})

export const initProduct = () => ({
  type: INIT_PRODUCT
})

export const productEnd = () => ({
  type: PRODUCT_END
})
