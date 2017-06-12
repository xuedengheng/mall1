import {combineReducers} from 'redux'
import product from './product'
import search from './search'
import showcase from './showcase'
import catelog from './catelog'
import account from './account'
import life from './life'
import cart from './cart'
import coupon from './coupon'
import mine from './mine'
import wallet from './wallet'
import ewuCard from './ewuCard'
import address from './address'
import promotion from './promotion'
import pay from './pay'
import orders from './orders'
import refunds from './refunds'
import activity from './activity'
import submitOrder from './submitOrder'
import query from './querys'
import presubmit from './presubmit'
import common from './common'
import personal from './personal'

const rootReducer = combineReducers({
  account,
  product,
  search,
  showcase,
  catelog,
  query,
  life,
  cart,
  coupon,
  mine,
  wallet,
  ewuCard,
  address,
  promotion,
  pay,
  orders,
  refunds,
  activity,
  submitOrder,
  presubmit,
  common,
  personal
});

export default rootReducer;
