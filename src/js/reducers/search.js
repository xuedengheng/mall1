/**
 * Created by Ben on 2016/12/24.
 */
import {
    SEARCH_FETCH,
    SEARCH_FETCH_SUCCESS,
    INIT_SEARCH,
    SEARCH_END
} from 'actions/actionsTypes'

const init = {
    isFetching: false,
    none: false,
    items: [],
};

export default function search(state = init, action) {
    switch (action.type) {
        case SEARCH_FETCH:
            return {
                ...state,
                isFetching: true,
            }
        case SEARCH_FETCH_SUCCESS:
            return {
                ...state,
                isFetching: false,
                items: action.result,
                none: action.result.length === 0,
            }
        case INIT_SEARCH:
            return {
                ...state,
                isFetching: false,
                none: false,
                items: []
            }
        case SEARCH_END:
            return {
                ...state,
                isFetching: false
            }
        default:
            return state
    }
}