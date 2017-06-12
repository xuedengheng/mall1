/**
 * Created by Ben on 2017/3/13.
 */
import {
    PROMOTION_QUERY,
    SUCCESS_PROMOTION_QUERY,
    PROMOTION_CALCULATE,
    SUCCESS_PROMOTION_CALCULATE,
    PROMOTION_END
} from 'actions/actionsTypes'

const init = {
    isFetching: false,
    query: [],
    calculate: []
}

export default function promotion (state=init, action) {
    switch (action.type) {
        case PROMOTION_QUERY:
            return {
                ...state,
                isFetching: true
            }
        case SUCCESS_PROMOTION_QUERY:
            return {
                ...state,
                isFetching: false,
                query: action.result,
            }
        case PROMOTION_CALCULATE:
            return {
                ...state,
                isFetching: true
            }
        case SUCCESS_PROMOTION_CALCULATE:
            return {
                ...state,
                isFetching: false,
                calculate: action.result,
            }
        case PROMOTION_END:
            return {
                ...state,
                isFetching: false
            }
        default:
            return state
    }
}