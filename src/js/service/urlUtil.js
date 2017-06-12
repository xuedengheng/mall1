/**
 * Created by Ben on 2017/3/8.
 */
import confidential from '../config/Confidential'
//删除参数值
export function delQueStr(url, ref) {
  let str = "";
  if (url.indexOf('?') != -1) {
    str = url.substr(url.indexOf('?') + 1);
  }
  else {
    return url;
  }
  let arr = "";
  let returnurl = "";
  if (str.indexOf('&') != -1) {
    arr = str.split('&');
    for (let i in arr) {
      if (arr[i].split('=')[0] != ref) {
        returnurl = returnurl + arr[i].split('=')[0] + "=" + arr[i].split('=')[1] + "&";
      }
    }
    return url.substr(0, url.indexOf('?')) + "?" + returnurl.substr(0, returnurl.length - 1);
  }
  else {
    arr = str.split('=');
    if (arr[0] == ref) {
      return url.substr(0, url.indexOf('?'));
    }
    else {
      return url;
    }
  }
}

export function getQueryString(search, name) {
  let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  let r = search.substr(1).split('/')[0].match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

export function buildInvitation(url) {
  if (url.indexOf('?') === -1) {
    return `${url}?account=${localStorage.account}&mChannal=${confidential.M_CHANNAL}`
  } else {
    return `${url}&account=${localStorage.account}&mChannal=${confidential.M_CHANNAL}`
  }
}