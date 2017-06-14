/**
 * Created by Ben on 2017/3/11.
 */
import {Constant} from 'service';


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

export const isLimitInput = (type, value) => {
  var pattern = '';
  if (type === Constant.MOBILE_PATTERN) {
    pattern = /[^0-9]/g;
  } else if (type === Constant.PWD_PATTERN) {
    pattern = /[^0-9A-Za-z_]/g;
  } else if (type === Constant.NAME_PATTERN) {
    pattern = /[^0-9A-Za-z_\u4e00-\u9fa5]/g;
  } else if (type === Constant.IDENTITY_PATTERN) {
    pattern = /[^0-9A-Za-z]/g;
  } else if (type === Constant.ADDRESS_PATTERN) {
    pattern = /[^0-9A-Za-z‘；：”“'。，、？()_+=\-'’\[（{}）——|【】\]:;',！!~@#&*$%^.:;'" <>《》/?\u4e00-\u9fa5]/g;
  } else if (type === Constant.TEXT_PATTERN) {
    pattern = /[^0-9A-Za-z‘；：”“'。，、？()_+=\-'’\[（{}）——|【】\]:;',！!~@#&*$%^.:;'" <>《》/?\u4e00-\u9fa5]/g;
  } else if (type === Constant.MONEY_PATTERN) {
    pattern = /[^0-9.]/g;
  }
  return value ? value.replace(pattern, '') : '';
}

export const isAccepted = (type, value) => {
  var pattern;
  if (type === Constant.MOBILE_PATTERN) {
    pattern = new RegExp(/[^0-9]/g);
  } else if (type === Constant.PWD_PATTERN) {
    pattern = new RegExp(/[^0-9A-Za-z_]/g);
  } else if (type === Constant.NAME_PATTERN) {
    pattern = new RegExp(/[^0-9A-Za-z_\u4e00-\u9fa5]/g);
  } else if (type === Constant.IDENTITY_PATTERN) {
    pattern = new RegExp(/^[0-9A-Za-z]*$/);
  } else if (type === Constant.TEXT_PATTERN) {
    pattern = new RegExp(/^[‘；：”“'。，、？()_+=\-'’\[（{}）——|【】\]:;',！!~@#&*$%^.:;'" <>《》/?\n\w\u4e00-\u9fa5]*$/)
  }
  return pattern.test(value);
}