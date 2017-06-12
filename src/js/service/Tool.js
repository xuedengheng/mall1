/**
 * Created by Ben on 2017/3/24.
 */
import URI from 'urijs'
export const Tool = {};

Tool.setSearchParams = data => {
  let paramArr = [];
  let paramStr = '';
  if (data.length) {
    data.map(item => {
      for (let attr in item) {
        if (item[attr]) paramArr.push(attr + '=' + item[attr]);
      }
    })
  } else {
    for (let attr in data) {
      if (data[attr]) paramArr.push(attr + '=' + data[attr]);
    }
  }
  paramStr = paramArr.join('&');
  paramStr = '?' + paramStr;
  return paramStr
}

Tool.setRequestParams = (url, search) => {
  return {url, search}
}

//判断是否微信登陆
Tool.isWeiXin = () => {
  let ua = window.navigator.userAgent.toLowerCase();
  //mozilla/5.0 (iphone; cpu iphone os 9_1 like mac os x) applewebkit/601.1.46 (khtml, like gecko)version/9.0 mobile/13b143 safari/601.1
  if (ua.match(/MicroMessenger/i) == 'micromessenger') {
    return true;
  } else {
    return false;
  }
}

Tool.isQQ = () => {
  let ua = window.navigator.userAgent.toLowerCase();
  if (ua.indexOf('mqqbrowser') !== -1) {
    return true;
  } else {
    return false
  }
}

Tool.isWeibo = () => {
  let ua = navigator.userAgent;
  if(ua.indexOf('Weibo') !== -1) {
    return true;
  } else {
    return false;
  }
}

Tool.generateGetCodeUrl = redirectURL => {
  return new URI("http://wechat.9yiwu.com/account-service/wechat/redirectToTarget")
    .addQuery("target", encodeURIComponent(redirectURL))
    .toString();
}

export const OrderStatus = {
  all: '1000',
  prepay: '0',
  unpay: '10',
  unallocated: '20',
  unsend: '30',
  uncomment: '50',
  untake: '40',
  success: '60',
  refund: '70',
  refundProcessing: '75',
  refundFail: '79',
  cancel: '90',
  delete: '99'
};

export const CouponType = {
  adopted: 'ADOPTED',
  used: 'USED',
  expired: 'EXPIRED'
}

