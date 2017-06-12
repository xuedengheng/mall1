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
} from 'actions/actionsTypes'

const init = {
    isFetching: false,
    purchased: [],
    purchasedEmpty: false,
    applied: [],
    appliedEmpty: false,
    detail: []
}

export default function ewuCard(state = init, action) {
    switch (action.type) {
        case QUERY_CARD:
            return {
                ...state,
                isFetching: true
            }
        case QUERY_CARD_SUCCESS:
            return {
                ...state,
                isFetching: false,
                purchased: action.purchased,
                purchasedEmpty: action.purchased.length === 0,
                applied: action.applied,
                appliedEmpty: action.applied.length === 0
            }
        case QUERY_CARD_DETAIL:
            return {
                ...state,
                isFetching: true
            }
        case QUERY_CARD_DETAIL_SUCCESS:
            return {
                ...state,
                isFetching: false,
                detail: action.result
            }
        case INIT_CARD:
            return {
                ...state,
                isFetching: false,
                purchasedEmpty: false,
                appliedEmpty: false
            }
        case EWUCARD_END:
            return {
                ...state,
                isFetching: false
            }
        default:
            return state
    }
}