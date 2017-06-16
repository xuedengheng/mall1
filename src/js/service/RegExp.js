/**
 * Created by Ben on 2017/3/11.
 */
const mobileReg = new RegExp(/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1}))+\d{8})$/)
const postcodeReg = new RegExp(/^[0-9]{5,6}$/)
const nickNameReg = new RegExp(/^[_\n\w\u4e00-\u9fa5]*$/)
const moneyReg = new RegExp(/^[1-9]([0-9]{0,6})(\.[0-9]{2})|([0-9]*)|([0-9]\.[0-9]{2})$/)

export const isMobile = (text) => {
  return mobileReg.test(text)
}

export const isPostcode = (text) => {
  return postcodeReg.test(text)
}

export const isNickName = (text) => {
  return nickNameReg.test(text)
}

export const isMoney = (text) => {
  return moneyReg.test(text)
}