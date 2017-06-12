/**
 * Created by Ben on 2017/3/11.
 */
import {
    PRESUBMIT,
    PRESUBMIT_SUCCESS
} from './actionsTypes'

export const presubmit = params => ({
    type: PRESUBMIT,
    params
})

export const presubmitSuccess = result => ({
    type: PRESUBMIT_SUCCESS,
    result
})