/**
 * Created by Ben on 2017/3/11.
 */
import {takeEvery} from 'redux-saga'
import {put} from 'redux-saga/effects'
import {Toast} from 'antd-mobile'
import history from 'service/history'
import {
  ERROR,
  PRESUBMIT,
  PRESUBMIT_SUCCESS,
  TOGGLE_PRODUCT_MODAL
} from 'actions/actionsTypes'

//存储sku
function* presubmit(action) {
  let result = action.params.data;
  let status = action.params.status;
  yield put({type: PRESUBMIT_SUCCESS, result, status});
  if (status === 'product') {
    history.push('/submit_order?mode=immediately');
    yield put({type: TOGGLE_PRODUCT_MODAL, status: false})
  } else {
    history.push('/submit_order')
  }
}

export function* watchPresubmit() {
  yield takeEvery(PRESUBMIT, presubmit)
}

function* errorCtrl(action) {
  Toast.info(action.error)
}

export function* watchError() {
  yield takeEvery(ERROR, errorCtrl)
}
