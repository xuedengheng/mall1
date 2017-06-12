/**
 * Created by Ben on 2017/3/13.
 */
import {
    PROMOTION_QUERY,
    SUCCESS_PROMOTION_QUERY,
    PROMOTION_CALCULATE,
    SUCCESS_PROMOTION_CALCULATE,
    PROMOTION_END
} from './actionsTypes'

export const queryPromotion = params => ({
    type: PROMOTION_QUERY,
    params
})

export const queryPromotionSuccess = result => ({
    type: SUCCESS_PROMOTION_QUERY,
    result
})

export const calculatePromotion = params => ({
    type: PROMOTION_CALCULATE,
    params
})

export const calculatePromotionSuccess = result => ({
    type: SUCCESS_PROMOTION_CALCULATE,
    result
})

export const promotionEnd = () => ({
    type: PROMOTION_END
})
