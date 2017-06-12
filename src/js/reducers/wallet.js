/**
 * Created by Ben on 2017/2/27.
 */
import {
    QUERY_WALLET,
    QUERY_WALLET_SUCCESS,
    QUERY_JOURNAL,
    QUERY_JOURNAL_SUCCESS,
    QUERY_JOURNAL_DETAIL,
    QUERY_JOURNAL_DETAIL_SUCCESS,
    INIT_WALLET,
    WALLET_END
} from 'actions/actionsTypes'

const init = {
    isFetching: false,
    wallet: [],
    income: [],
    outcome: [],
    incomeEmpty: false,
    outcomeEmpty: false,
    journaldetail: []
}

export default function wallet(state= init, action) {
    switch (action.type) {
        case QUERY_WALLET:
            return {
                ...state,
                isFetching: true
            }
        case QUERY_WALLET_SUCCESS:
            return {
                ...state,
                isFetching: false,
                wallet: action.result
            }
        case QUERY_JOURNAL:
            return {
                ...state,
                isFetching: true
            }
        case QUERY_JOURNAL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                income: action.income,
                incomeEmpty: action.income.length === 0,
                outcome: action.outcome,
                outcomeEmpty: action.outcome.length === 0
            }
        case QUERY_JOURNAL_DETAIL:
            return{
                ...state,
                isFetching:true
            }
        case QUERY_JOURNAL_DETAIL_SUCCESS:
            return{
                ...state,
                isFetching:false,
                journaldetail:action.result
            }
        case INIT_WALLET:
            return {
                ...state,
                isFetching: false,
                income: [],
                outcome: [],
                incomeEmpty: false,
                outcomeEmpty: false
            }
        case WALLET_END:
            return {
                ...state,
                isFetching: false
            }
        default:
            return state
    }
}