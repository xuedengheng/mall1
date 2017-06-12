/**
 * Created by Ben on 2017/2/27.
 */
import {
    takeEvery,
} from 'redux-saga'
import {
    put,
    call,
} from 'redux-saga/effects'
import {fetchApi, urlApi, Tool} from 'service'
import {
    QUERY_WALLET,
    QUERY_WALLET_SUCCESS,
    QUERY_JOURNAL,
    QUERY_JOURNAL_SUCCESS,
    QUERY_JOURNAL_DETAIL,
    QUERY_JOURNAL_DETAIL_SUCCESS,
    WALLET_END,
    ERROR,
} from '../actions/actionsTypes'

function* getWallet(action) {
    try {
        let result = yield call(fetchApi.get, {url: `${urlApi.wallet.wallet}/${localStorage.account}`});
        if (result.success) {
            if (action.AND) {
                yield [
                    put({type: QUERY_WALLET_SUCCESS, result: result.wallet}),
                    put({type: QUERY_JOURNAL})
                ]
            } else {
                yield put({type: QUERY_WALLET_SUCCESS, result: result.wallet});
            }
        } else {
            yield [
                put({type: WALLET_END}),
                put({type: ERROR, error: result.msg})
            ]

        }
    } catch (e) {
        yield [
            put({type: WALLET_END}),
            put({type: ERROR, error: "网络请求失败，请检查您的网络"})
        ]
    }
}

export function* watchWallet() {
    yield takeEvery(QUERY_WALLET, getWallet);
}

function* getJournal() {
    try {
        let incomeParams = {
            url: urlApi.wallet.journal + Tool.setSearchParams([
                {
                    types: 'Drawback'
                },
                {
                    account: localStorage.account,
                    types: 'Income',
                    pageNumber: '0',
                    pageSize: 10
                }
            ])
        }
        let outcomeParams = {
            url: urlApi.wallet.journal + Tool.setSearchParams({
                account: localStorage.account,
                types: 'Outcome',
                pageNumber: '0',
                pageSize: 10
            })
        }
        let incomeJson = yield call(fetchApi.get, incomeParams);
        let outcomeJson = yield call(fetchApi.get, outcomeParams)
        if (incomeJson.success && outcomeJson.success) {
            yield put({type: QUERY_JOURNAL_SUCCESS, income: incomeJson.history, outcome: outcomeJson.history})
        } else {
            yield [
                put({type: WALLET_END}),
                put({type: ERROR, error: incomeJson.msg})
            ]
        }
    } catch (e) {
        yield put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    }
}

export function* watchJournal() {
    yield takeEvery(QUERY_JOURNAL, getJournal)
}


function* getJournalDetail(action) {
    try {
        const {sequenceId, type} = action.params;
        let result = yield call(
            fetchApi.get,
            {url: `${urlApi.wallet.detail}/${localStorage.account}/${sequenceId}/${type}`}
        );
        if (result.success) {
            yield put({type: QUERY_JOURNAL_DETAIL_SUCCESS, result: result.history[0]})
        } else {
            yield [
                put({type: WALLET_END}),
                put({type: ERROR, error: result.msg})
            ]
        }
    } catch (e) {
        yield put({type: ERROR, error: "网络请求失败，请检查您的网络"})
    }
}

export function* watchJournalDetail() {
    yield takeEvery(QUERY_JOURNAL_DETAIL, getJournalDetail)
}



