/**
 * Created by Ben on 2017/3/27.
 */
import {
    ERROR
    LOADING,
} from './actionsTypes'

export const catchError = error => ({
    type: ERROR,
    error
})

export const loading = status => ({
    type: LOADING,
    status
})
