/**
 * Created by Ben on 2017/1/13.
 */
import {
    FETCH_LIFE,
    FETCH_LIFE_SUCCESS,
    FETCH_ARTICLE,
    FETCH_ARTICLE_SUCCESS,
    LIFE_END,
    ADD_ID,
    SAVE_ID
} from 'actions/actionsTypes'

const init = {
    isFetching: false,
    id:'',
    life: [],
    article: [],
    error: []
}

export default function life (state = init, action) {
    switch (action.type) {
        case FETCH_LIFE:
            return {
                ...state,
                isFetching: true
            }
        case FETCH_LIFE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                life: action.result
            }
        case FETCH_ARTICLE:
            return {
                ...state,
                isFetching: true
            }
        case FETCH_ARTICLE_SUCCESS:
            return {
                ...state,
                isFetching: false,
                article: action.result
            }
        case LIFE_END:
            return {
                ...state,
                isFetching: false
            }
        case ADD_ID:
            return {
                ...state,
            }
        case SAVE_ID:
            return {
                ...state,
                id: action.id
            }
        default:
            return state
    }
}