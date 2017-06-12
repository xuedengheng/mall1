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
} from 'actions/actionsTypes'

const init = {
  isFetching: false,
  activeKey: '1',
  product: [],
  richDetail: [],
  search: [],
  attributes: [],
  stocks: [],
  visible: false,
  type: null
};

export default function product(state = init, action) {
  switch (action.type) {
    case PRODUCT_FETCH:
      return {
        ...state,
        isFetching: true
      }
    case PRODUCT_FETCH_SUCCESS:
      return {
        ...state,
        product: action.product,
        attributes: action.attributes,
        stocks: action.stocks
      }
    case RICHDETAIL_FETCH:
      return {
        ...state,
      }
    case RICHDETAIL_FETCH_SUCCESS:
      return {
        ...state,
        richDetail: action.richDetail,
        lastUpdated: action.receivedAt
      }
    case FETCH_PRODUCT_INTREST:
      return {
        ...state,
        isFetching: true
      }
    case FETCH_PRODUCT_INTREST_SUCCESS:
      return {
        ...state,
        isFetchgin: false,
        search: action.payload
      }
    case PRODUCT_END:
      return {
        ...state,
        activeKey: '1',
        isFetching: false
      }
    case SET_ACTIVEKEY:
      return {
        ...state,
        activeKey: action.key
      }
    case TOGGLE_PRODUCT_MODAL:
      return {
        ...state,
        visible: action.status,
        type: action.showType
      }
    case CHECKOUT_PRODUCT:
      return {
        ...state,
        isFetching: true
      }
    case INIT_PRODUCT:
      return {
        ...state,
        product: []
      }
    default:
      return state
  }
}