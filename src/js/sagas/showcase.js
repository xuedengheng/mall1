/**
 * Created by Ben on 2016/12/28.
 */
import {takeEvery} from 'redux-saga'
import {put, call, fork} from 'redux-saga/effects'
import {urlApi, fetchApi} from 'service'
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
  SHOWCASE_END,
  ERROR,
} from '../actions/actionsTypes'

//getList
function* getList(action) {
  try {
    let list = yield call(fetchApi.get, action.params);
    if (list.success) {
      yield [
        put({type: SHOWCASE_LIST_FETCH_SUCCESS, list: list.result}),
        fork(getDefaultTemplate, action.showcaseId ? action.showcaseId : list.result[0].showcaseId)
      ]
    } else {
      yield [
        put({type: SHOWCASE_END}),
        put({type: ERROR, error: list.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: SHOWCASE_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

function* getDefaultTemplate(showcaseId) {
  yield put({type: SHOWCASE_TEMPLATE_FETCH, params: {url: urlApi.showcase.template + '/' + showcaseId}})
}

export function* watchShowcaseList() {
  yield takeEvery(SHOWCASE_LIST_FETCH, getList)
}

//getShowcaseTemplate
function* getShowcaseTemplate(action) {
  try {
    let template = yield call(fetchApi.get, action.params);
    if (template.success) {
      window.scrollTo(0, 0);
      yield [
        put({type: SHOWCASE_TEMPLATE_FETCH_SUCCESS, template: template.result}),
        fork(getProduct, template.result.components),
        put({type: SHOWCASE_END})
      ]
    } else {
      yield [
        put({type: SHOWCASE_END}),
        put({type: ERROR, error: template.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: SHOWCASE_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

function* getProduct(template) {
  if (template.length) {
    let recommondIds = [];
    let productListIds = [];
    template.map(item => {
      if (item.type === 'recommend') {
        recommondIds.push({
          url: urlApi.product.productList, search: item.items.map(productId => {
            return {productIds: productId.id}
          })
        })
      } else if (item.type === 'product_list') {
        productListIds.push({
          url: urlApi.product.productList, search: item.items.map(productId => {
            return {productIds: productId.id}
          })
        })
      }
    });
    if (recommondIds.length > 0) {
      yield put({type: RECOMMOND_FETCH, params: recommondIds})
    }
    if (productListIds.length > 0) {
      yield put({type: PRODUCT_LIST_FETCH, params: productListIds})
    }
  }
}

export function* watchShowcaseTemplate() {
  yield takeEvery(SHOWCASE_TEMPLATE_FETCH, getShowcaseTemplate)
}

//getTemplate
function* getTemplate(action) {
  try {
    let temp = yield call(fetchApi.get, action.params);
    if (temp.success) {
      yield [
        put({type: TEMPLATE_SUCCESS, temp: temp.result}),
        fork(getProduct, temp.result.components)
      ]
    } else {
      yield [
        put({type: SHOWCASE_END}),
        put({type: ERROR, error: temp.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: SHOWCASE_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchTemplate() {
  yield takeEvery(TEMPLATE_FETCH, getTemplate)
}

//getRecommond
function* getRecommond(action) {
  try {
    let recommond = yield call(fetchApi.get, action.params);
    yield put({type: RECOMMOND_FETCH_SUCCESS, recommond: recommond})
  } catch (e) {
    yield [
      put({type: SHOWCASE_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchRecommond() {
  yield takeEvery(RECOMMOND_FETCH, getRecommond);
}

function* getProductList(action) {
  try {
    let productList = yield call(fetchApi.get, action.params)
    yield put({type: PRODUCT_LIST_FETCH_SUCCESS, productList: productList})
  } catch (e) {
    yield put({type: ERROR, error: "网络请求失败，请检查您的网络"})
  }
}

export function* watchProductList() {
  yield takeEvery(PRODUCT_LIST_FETCH, getProductList);
}