/**
 * Created by Ben on 2017/3/27.
 */
import {
    ERROR,
    LOADING
} from 'actions/actionsTypes'

const init = {
    error: '',
    loading: false,
}

export default function common(state = init, action) {
    switch (action.type) {
        case ERROR:
            return {
                error: action.error
            }
        case LOADING:
            return {
                loading: action.status
            }
        default:
            return state
    }
}