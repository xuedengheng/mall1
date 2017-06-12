/**
 * Created by Ben on 2017/3/1.
 */
import {
    QUERY_CARD,
    QUERY_CARD_SUCCESS,
    QUERY_CARD_DETAIL,
    QUERY_CARD_DETAIL_SUCCESS,
    INIT_CARD,
    EWUCARD_END
} from './actionsTypes'

export const queryCard = () => ({
    type: QUERY_CARD
})

export const queryCardSuccess = (purchased, applied) => ({
    type: QUERY_CARD_SUCCESS,
    purchased,
    applied,
})

export const queryCardDetail = params => ({
    type: QUERY_CARD_DETAIL,
    params
})

export const queryCardDetailSuccess = result => ({
    type: QUERY_CARD_DETAIL_SUCCESS,
    result
})

export const initCard = () => ({
    type: INIT_CARD
})

export const ewucardEnd = () => ({
    type: EWUCARD_END
})
