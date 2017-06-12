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
} from './actionsTypes'

export const queryWallet = AND => ({
    type: QUERY_WALLET,
    AND
})

export const queryWalletSuccess = result => ({
    type: QUERY_WALLET_SUCCESS,
    result
})

export const queryJournal = () => ({
    type: QUERY_JOURNAL,
})

export const queryJournalSuccess = (income, outcome) => ({
    type: QUERY_JOURNAL_SUCCESS,
    income,
    outcome
})

export const queryJournalDetail = params =>({
    type: QUERY_JOURNAL_DETAIL,
    params
})

export const queryJounrnalDetailSuccess = result =>({
    type: QUERY_JOURNAL_DETAIL_SUCCESS,
    result
})

export const initWallet = () => ({
    type: INIT_WALLET
})

export const walletEnd = () => ({
    type: WALLET_END
})

