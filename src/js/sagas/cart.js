/**
 * Created by Ben on 2017/1/16.
 */
import {
  takeEvery,
} from 'redux-saga'
import {
  put,
  call,
} from 'redux-saga/effects'
import {Toast} from 'antd-mobile'
import {fetchApi, skuHandle, urlApi, Tool} from 'service'
import {
  PRODUCT_FETCH,
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
  PRESUBMIT,
  END_CART_OPERATION,
  TOGGLE_PRODUCT_MODAL,
  CANCEL_CHECK,
  ERROR
} from '../actions/actionsTypes'

function* getList() {
  try {
    let params = {url: urlApi.cart.query, search: {mobilePhone: localStorage.account}};
    let json = yield call(fetchApi.get, params);
    if (json.success && json.result.cart) {
      yield put({type: QUERY_CART_SUCCESS, result: json.result.cart})
    } else {
      yield [
        put({type: END_CART_OPERATION}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_CART_OPERATION}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchCartList() {
  yield takeEvery(QUERY_CART, getList);
}

function* addCart(action) {
  try {
    let params = {url: urlApi.cart.add, search: action.params};
    let result = yield call(fetchApi.postJson, params);
    if (result.success) {
      if (action.closeProductModal) {
        yield put({type: TOGGLE_PRODUCT_MODAL, status: false})
      }
      yield put({type: ADD_CART_SUCCESS})
    } else {
      yield [
        put({type: END_CART_OPERATION}),
        put({type: ERROR, error: result.msg})
      ]
      if (action.productId) {
        yield [
          put({type: TOGGLE_PRODUCT_MODAL, status: false}),
          put ({type: PRODUCT_FETCH, productId: action.productId}),
        ]
      }
    }
  } catch (e) {
    yield [
      put({type: END_CART_OPERATION}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
    if (action.productId) {
      yield [
        put({type: TOGGLE_PRODUCT_MODAL, status: false}),
        put ({type: PRODUCT_FETCH, productId: action.productId}),
      ]
    }
  }
}

export function* watchAddCart() {
  yield takeEvery(ADD_CART, addCart)
}

function* addCartSuccess() {
  yield put({type: CLOSE_CART_MODAL});
  Toast.info('加入购物车成功')
}

export function* watchAddCartSuccess() {
  yield takeEvery(ADD_CART_SUCCESS, addCartSuccess)
}

function* updateCart(action) {
  try {
    let url = `${urlApi.cart.edit}${Tool.setSearchParams(action.params)}`
    let result = yield call(fetchApi.post, {url});
    if (result.success) {
      yield [
        put({type: UPDATE_CART_SUCCESS}),
        put({type: QUERY_CART})
      ]
    } else {
      yield [
        put({type: END_CART_OPERATION}),
        put({type: ERROR, error: result.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_CART_OPERATION}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchUpdateCart() {
  yield takeEvery(UPDATE_CART, updateCart)
}

function* removeCart(action) {
  try {
    let url = `${urlApi.cart.remove}${Tool.setSearchParams(action.params)}`;
    let json = yield call(fetchApi.post, {url});
    if (json.success) {
      yield [
        put({type: REMOVE_CART_SUCCESS}),
        put({type: QUERY_CART})
      ]
    } else {
      yield [
        put({type: END_CART_OPERATION}),
        put({type: ERROR, error: json.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_CART_OPERATION}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchRemoveCart() {
  yield takeEvery(REMOVE_CART, removeCart);
}

function* checkoutOrder(action) {
  try {
    let json = yield call(fetchApi.post, {url: urlApi.checkout.presubmitorder + Tool.setSearchParams(action.params)})
    if (json.success) {
      let params = {
        status: 'cart',
        data: action.preOrderCarts
      }
      yield [
        put({type: END_CART_OPERATION}),
        put({type: PRESUBMIT, params})
      ]
    } else {
      yield [
        put({type: END_CART_OPERATION}),
        put({type: ERROR, error: json.msg}),
        put({type: QUERY_CART}),
        put({type: CANCEL_CHECK})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_CART_OPERATION}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchCheckoutOrder() {
  yield takeEvery(CHECKOUT_ORDER, checkoutOrder)
}

function* openModal(action) {
  try {
    let product = yield call(fetchApi.get, action.params);
    if (product.success) {
      let data = product.result;
      let {attributes, stocks} = skuHandle(data);
      yield put({type: OPEN_CART_MODAL_SUCCESS, product: data, attributes, stocks});
    } else {
      yield [
        put({type: END_CART_OPERATION}),
        put({type: ERROR, error: product.msg})
      ]
    }
  } catch (e) {
    yield [
      put({type: END_CART_OPERATION}),
      put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    ]
  }
}

export function* watchOpenModal() {
  yield takeEvery(OPEN_CART_MODAL, openModal)
}
