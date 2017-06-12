import {
  takeEvery,
} from 'redux-saga'
import {
  put,
  call,
  fork
} from 'redux-saga/effects'
import _ from 'lodash'
import {fetchApi, skuHandle, urlApi, Tool} from 'service'
import {
  PRODUCT_FETCH,
  PRODUCT_FETCH_SUCCESS,
  RICHDETAIL_FETCH,
  RICHDETAIL_FETCH_SUCCESS,
  FETCH_PRODUCT_INTREST,
  FETCH_PRODUCT_INTREST_SUCCESS,
  TOGGLE_PRODUCT_MODAL,
  CHECKOUT_PRODUCT,
  PRODUCT_END,
  PRESUBMIT,
  ERROR,
} from '../actions/actionsTypes'

function* getProduct(action) {
  try {
    let params = {
      url: urlApi.product.detail,
      search: {productId: action.productId}
    }
    let product = yield call(fetchApi.get, params);
    if (product.success) {
      window.scrollTo(0, 0);
      let data = product.result;
      let {attributes, stocks} = skuHandle(data);
      yield fork(callRichDetail, data);
      yield put({type: PRODUCT_FETCH_SUCCESS, product: data, attributes, stocks});
      const {catalogId} = data;
      const params = {url: urlApi.search.query, search: {catalogIds: catalogId, pageSize: 20}};
      yield put({type: FETCH_PRODUCT_INTREST, params, productId: action.productId})
    } else {
      yield [
        put({type: PRODUCT_END}),
        put({type: ERROR, error: product.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: PRODUCT_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

function* callRichDetail(data) {
  let {storeId} = data;
  if (storeId === "JD") {
    let params = {
      url: urlApi.product.jdRichDetail,
      search: {sku: data.tpProductId}
    }
    yield put({type: RICHDETAIL_FETCH, params})
  } else {
    let params = {
      url: urlApi.product.richDetail,
      search: {productId: data.productId}
    }
    yield put({type: RICHDETAIL_FETCH, params})
  }
}

export function* watchProduct() {
  yield takeEvery(PRODUCT_FETCH, getProduct);
}

function* getRichDetail(action) {
  try {
    let richDetail = yield call(fetchApi.get, action.params);
    if (richDetail.success) {
      yield put({type: RICHDETAIL_FETCH_SUCCESS, richDetail: richDetail.result})
    } else {
      yield [
        put({type: PRODUCT_END}),
        put({type: ERROR, error: richDetail.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: PRODUCT_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchRichDetail() {
  yield takeEvery(RICHDETAIL_FETCH, getRichDetail);
}

function* getProductIntrest(action) {
  try {
    let json = yield call(fetchApi.get, action.params);
    if (json.success) {
      let payload = json.result.filter(item => item.productId !== action.productId);
      yield [
        put({
          type: FETCH_PRODUCT_INTREST_SUCCESS,
          payload,
        }),
        put({type: PRODUCT_END})
      ]
    } else {
      yield [
        put({type: PRODUCT_END}),
        put({type: ERROR, error: payload.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: PRODUCT_END}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchProductIntrest() {
  yield takeEvery(FETCH_PRODUCT_INTREST, getProductIntrest)
}

function* checkoutProduct(action) {
  try {
    const {productId, skuId, quantity, price} = action.params.data[0].skuPrices[0];
    const {storeId} = action.params.data[0];
    const json = yield call(fetchApi.get, {url: urlApi.product.detail + Tool.setSearchParams({productId})});
    if (json.success) {
      const detail = json.result;
      if (detail.status !== '1' || !detail.sku || detail.storeId !== storeId) {
        yield fork(reloadProduct, "该商品已失效，请重新购买", productId)
      } else {
        const sku = _.find(detail.sku, sku => sku.skuId === skuId);
        if (!sku) {
          yield fork(reloadProduct, "该商品已失效，请重新购买", productId)
        } else if (sku.price !== price) {
          yield fork(reloadProduct, "商品价格有变动，请重新购买", productId)
        } else if (quantity > sku.stock) {
          yield fork(reloadProduct, "库存不足", productId)
        } else {
          yield put({type: PRESUBMIT, params: action.params})
        }
      }
    } else {
      yield [
        put({type: PRODUCT_END}),
        put({type: ERROR, error: "网络请求失败，请检查您的网络"})
      ]
    }
  } catch (e) {
    yield fork(reloadProduct, "该商品已失效，请重新购买", productId)
  }
}

function* reloadProduct(error, productId) {
  yield [
    put({type: PRODUCT_END}),
    put({type: TOGGLE_PRODUCT_MODAL, status: false}),
    put({type: ERROR, error}),
    put({type: PRODUCT_FETCH, productId})
  ]
}

export function* watchCheckoutProduct() {
  yield takeEvery(CHECKOUT_PRODUCT, checkoutProduct)
}