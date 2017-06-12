/**
 * Created by Ben on 2016/12/24.
 */
import {
    SEARCH_FETCH,
    SEARCH_FETCH_SUCCESS,
    INIT_SEARCH,
    SEARCH_END
} from './actionsTypes'

export const fetchSearch = (params, status) => ({
    type: SEARCH_FETCH,
    params,
    status
});

export const successSearch = (search) => ({
    type: SEARCH_FETCH_SUCCESS,
    search
});

export const initSearch = () => ({
    type: INIT_SEARCH,
})

export const searchEnd = () => ({
    type: SEARCH_END
})
