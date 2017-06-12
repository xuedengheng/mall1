/**
 * Created by Ben on 2017/3/11.
 */
import {
    PRESUBMIT,
    PRESUBMIT_SUCCESS
} from 'actions/actionsTypes'

const init = {
    type: '',
    data: []
}

export default function presubmit(state = init, action) {
    switch (action.type) {
        case PRESUBMIT:
            return {
                ...state
            }
        case PRESUBMIT_SUCCESS:
            return {
                ...state,
                type: action.status,
                data: action.result
            }
        default:
            return {
                ...state
            }
    }
}