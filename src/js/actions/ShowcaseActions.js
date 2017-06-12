/**
 * Created by Ben on 2016/12/28.
 */
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
} from './actionsTypes'

export const fetchShowcaseList = (params, showcaseId) => ({
  type: SHOWCASE_LIST_FETCH,
  params,
  showcaseId
});
export const successShowcaseList = (list) => ({
  type: SHOWCASE_LIST_FETCH_SUCCESS,
  list
});

export const fetchShowcaseTemplate = (params) => ({
  type: SHOWCASE_TEMPLATE_FETCH,
  params
});
export const successShowcaseTemplate = (template) => ({
  type: SHOWCASE_TEMPLATE_FETCH_SUCCESS,
  template
});

export const fetchTemplate = (params) => ({
  type: TEMPLATE_FETCH,
  params
})
export const successTemplate = (temp) => ({
  type: TEMPLATE_SUCCESS,
  temp
})

export const fetchRecommond = (params) => ({
  type: RECOMMOND_FETCH,
  params
});
export const successRecommond = (recommond) => ({
  type: RECOMMOND_FETCH_SUCCESS,
  recommond
});

export const fetchProductList = (params) => ({
  type: PRODUCT_LIST_FETCH,
  params
})

export const successProductList = (productList) => ({
  type: PRODUCT_LIST_FETCH_SUCCESS,
  productList
})

export const saveShowCaseId = showcaseId => ({
  type: SAVE_SHOWCASE_ID,
  showcaseId
})

export const showcaseEnd = () => ({
  type: SHOWCASE_END
})
