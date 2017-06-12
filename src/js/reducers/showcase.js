import {
  SHOWCASE_LIST_FETCH,
  SHOWCASE_LIST_FETCH_SUCCESS,
  SHOWCASE_TEMPLATE_FETCH,
  SHOWCASE_TEMPLATE_FETCH_SUCCESS,
  RECOMMOND_FETCH,
  RECOMMOND_FETCH_SUCCESS,
  PRODUCT_LIST_FETCH,
  PRODUCT_LIST_FETCH_SUCCESS,
  TEMPLATE_FETCH,
  TEMPLATE_SUCCESS,
  SAVE_SHOWCASE_ID,
  SHOWCASE_END
} from 'actions/actionsTypes'

const init = {
  isFetching: false,
  showcaseId: null,
  list: [],
  template: [],
  temp: [],
  recommond: [],
  items: []
};

export default function showcase(state = init, action) {
  switch (action.type) {
    case SHOWCASE_LIST_FETCH:
      return {
        ...state,
        isFetching: true
      }
    case SHOWCASE_LIST_FETCH_SUCCESS:
      return {
        ...state,
        list: action.list,
      }
    case SHOWCASE_TEMPLATE_FETCH:
      return {
        ...state,
        isFetching: true
      }
    case SHOWCASE_TEMPLATE_FETCH_SUCCESS:
      return {
        ...state,
        template: action.template
      }
    case TEMPLATE_FETCH:
      return {
        ...state,
        isFetching: true,
      }
    case TEMPLATE_SUCCESS:
      return {
        ...state,
        isFetching: false,
        temp: action.temp
      }
    case RECOMMOND_FETCH:
      return {
        ...state,
      }
    case RECOMMOND_FETCH_SUCCESS:
      return {
        ...state,
        recommond: action.recommond
      }
    case PRODUCT_LIST_FETCH:
      return {
        ...state,
      }
    case PRODUCT_LIST_FETCH_SUCCESS:
      return {
        ...state,
        items: action.productList,
      }
    case SAVE_SHOWCASE_ID:
      return {
        ...state,
        showcaseId: action.showcaseId
      }
    case SHOWCASE_END:
      return {
        ...state,
        isFetching: false
      }
    default:
      return state
  }
}