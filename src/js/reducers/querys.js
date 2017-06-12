/**
 * Created by Ben on 2017/1/6.
 */
import {
    ADD_QUERYPARAMS,
    SAVE_QUERYPARAMS
} from 'actions/actionsTypes'

const init = {
    params: {}
}

export default function query (state = init, action) {
    switch (action.type) {
        case ADD_QUERYPARAMS:
            return {
                ...state
            }
        case SAVE_QUERYPARAMS:
            return {
                ...state,
                params: action.query,
                lastUpdated: action.receivedAt
            }
        default:
            return state
    }
}