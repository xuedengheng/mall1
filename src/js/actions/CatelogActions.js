/**
 * Created by Ben on 2017/1/4.
 */
import {
    CATELOG_FETCH,
    CATELOG_FETCH_SUCCESS,
    CATELOG_END
} from './actionsTypes'

export const fetchCatelog = (params) => ({
    type: CATELOG_FETCH,
    params
})

export const successCatelog = (catelog) => ({
    type: CATELOG_FETCH_SUCCESS,
    catelog
})

export const catelogEnd = () => ({
    type: CATELOG_END
})
