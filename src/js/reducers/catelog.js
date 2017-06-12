/**
 * Created by Ben on 2017/1/4.
 */
import {
    CATELOG_FETCH,
    CATELOG_FETCH_SUCCESS,
    CATELOG_END
} from 'actions/actionsTypes'

const init = {
    isFetching: false,
    items: []
}

export default function catelog(state = init, action) {
    switch (action.type) {
        case CATELOG_FETCH:
            return {
                ...state,
                isFetching: true,
            }
        case CATELOG_FETCH_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.catelog,
                lastUpdated: action.receivedAt
            }
        case CATELOG_END:
            return {
                ...state,
                isFetching: false
            }
        default:
            return state
    }
}