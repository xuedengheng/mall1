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
} from './actionsTypes'

export const fetchLife = params => ({
    type: FETCH_LIFE,
    params
})

export const fetchLifeSuccess = life => ({
    type: FETCH_LIFE_SUCCESS,
    life
})

export const fetchArticle = params => ({
    type: FETCH_ARTICLE,
    params
})

export const fetchArticleSuccess = article => ({
    type: FETCH_ARTICLE_SUCCESS,
    article
})

export const lifeEnd = () => ({
    type: LIFE_END
})

export const addId = id => ({
    type: ADD_ID,
    id
})

export const saveId = id => ({
    type: SAVE_ID,
    id
})