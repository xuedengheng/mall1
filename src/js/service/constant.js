/**
 * Created by Ben on 2017/4/17.
 */
/***********************************************  常量  ********************************************************/

export const CDN_HOST = 'http://test.9yiwu.com';

//mchannal
export const NG_APP = 'NG_APP';
export const YX_APP = 'YX_APP';

//支付常量
export const TRADE_TYPE = "JSAPI";
export const UNION_PAY_FLAG = "union";
//支付方式
/*
 *  key支付
 * */
export const KEY_WAY = "payway";
/*
 * 微信支付
 * */
export const WAY_WX = "WEIXIN";
/*
 * 支付宝支付
 * */
export const WAY_ALI = "ALIPAY";
/*
 * 易物卡支付
 * */
export const WAY_YW = "YIWUCOIN";
/*
 * 飞马钱包支付
 * */
export const WAY_FM = "FEIMA";


//限时购倒计时状态
export const DID = 'DID';
export const ING = 'ING';
export const WILL = 'WILL';

//飞马回调链接
export const FEIMA_PAGE = window.location.origin + window.location.pathname + '#/pay_result';

//快递公司
export const EXPRESS_CORP = [
  {value: 'SF', label: '顺丰快递'},
  {value: 'JD', label: '京东快递'},
  {value: 'YTO', label: '圆通快递'},
  {value: 'STO', label: '申通快递'},
  {value: 'YUNDAEX', label: '韵达快递'},
  {value: 'BESTEX', label: '百世汇通'},
  {value: 'ZTO', label: '中通快递'},
  {value: 'QFKD', label: '全峰快递'},
  {value: 'TTKDEX', label: '天天快递'},
  {value: 'UCE', label: '优速快递'},
  {value: 'DEPPON', label: '德邦物流'},
  {value: 'HOAU', label: '天地华宇'},
  {value: 'LBEX', label: '龙邦快递'},
  {value: 'YCG', label: '远成快递'},
  {value: 'ZENY', label: '增益速递'},
  {value: 'SURE', label: '速尔快递'},
  {value: 'EMS', label: 'EMS'},
  {value: 'ZJS', label: '宅急送'},
  {value: 'GTO', label: '国通快递'},
  {value: 'ND', label: '港中能达'},
  {value: 'KJSD', label: '快捷速递'},
  {value: 'ANE', label: '安能物流'},
];

/***********************************************  枚举  ********************************************************/

/*
 * 退货退款订单状态枚举
 * */
export const PostPurchasedProcessStatus = status => {
  switch (status) {
    case "REJECT":
      return "已拒绝"
    case "IN_PROGRESSING":
      return "待审核"
    case "JUSTIFIED":
      return "已修改"
    case "PENDING_RETURN":
      return "待退货"
    case "USER_RETURNED":
      return "已退货"
    case "RECEIEVE_RETURN":
      return "已收货"
    case "NO_RECEIEVE_RETURN":
      return "货品失收"
    case "PENDING_REFUND":
      return "待退款"
    case "REFUNDED":
      return "已退款"
    default:
      return ""
  }
}

//根据退款状态返回不同信息
export const getRefundsMessage = (status, isJD) => {
  switch (status) {
    case "IN_PROGRESSING":
      return {
        icon: '../../../../../images/mine/refund/-refund_icon_review.png',
        btnText: "修改退款申请"
      }
    case "PENDING_RETURN":
      return {
        icon: '../../../../../images/mine/refund/-refund_icon_-return-goods.png',
        btnText: isJD ? "京东已取件" : "填写退货信息"
      }
    case "USER_RETURNED":
      return {
        icon: '../../../../../images/mine/refund/-refund_icon_-return-goods.png',
        btnText: isJD ? "" : "查看物流"
      }
    case "PENDING_REFUND":
      return {
        icon: '../../../../../images/mine/refund/-refund_icon_-refund.png',
      };
    case "REFUNDED":
      return {
        icon: '../../../../../images/mine/refund/-refund_icon_-refund-success.png',
      };
    case "REJECT":
      return {
        icon: '../../../../../images/mine/refund/refund-_icon_refund-failed.png',
      };
    default:
      return {}
  }
}

//退款类型枚举
export const getRefundType = requestRefundType => {
  switch (requestRefundType) {
    case "REFUND_ONLY":
      return "仅退款";
    case "RETURN_AND_REFUND":
      return "退货退款";
    default:
      return ""
  }
}

//退款状态枚举
export const getRefundFlag = requestRefundFlag => {
  switch (requestRefundFlag) {
    case "RECEIVED":
      return "已收到货物";
    case "PENDING_RECEIVE":
      return "未收到货物";
    default:
      return ""
  }
}

//退款追踪操作人枚举
export const getOperator = operator => {
  switch (operator) {
    case "SYSTEM":
      return {
        icon: 'refund_yi',
        name: '易物平台'
      }
    default:
      return {
        icon: 'refund_you',
        name: '您'
      }
  }
}

//获取平台名字
export const getPlatform = PID => {
  let id = PID.toString();
  switch (id) {
    case "2":
      return "京东自营";
    case "JD":
      return "京东自营";
    case "3":
      return "唯品发货";
    case "4":
      return "网易严选";
    case "WY":
      return "网易严选";
    case "5":
      return "聚美优品";
    default:
      return "易物研选";
  }
}
//获取平台icon
export const getPlatformId = PID => {
  let id = PID.toString();
  switch (id) {
    case "2":
      return "JD";
    case "3":
      return "VIP";
    case "4":
      return "WY";
    case "5":
      return "JUMEI";
    default:
      return "YIWU";
  }
}

//获取支付方式
export const getPayWay = type => {
  switch (type) {
    case "WEIXIN":
      return "微信支付";
    case "YIWUCOIN":
      return "易点支付";
    case "ALIPAY":
      return "支付宝支付";
    case "FEIMA":
      return "飞马钱包支付";
    default:
      return ""
  }
}

//订单状态枚举
export const getOrderStatus = status => {
  switch (status) {
    case "0":
      return "预支付";
    case "10":
      return "待支付";
    case "20":
      return "待配货";
    case "30":
      return "待发货";
    case "40":
      return "待收货";
    case "50":
      return "待评价";
    case "60":
      return "交易完成";
    case "70":
      return "已退款";
    case "75":
      return "退款中";
    case "79":
      return "退款失败";
    case "90":
      return "交易关闭";
    case "99":
      return "已删除";
    default:
      return "";
  }
}

//订单退款活动
export const changeActivity = type => {
  switch (type) {
    case 'TIME_LIMITATION':
      return '限时购';
    case 'NEW_USER_LIMITATION':
      return '新人专享';
    default:
      return '';
  }
}

//订单退款详情枚举
export const getDetailStatus = status => {
  switch (status) {
    case "IN_PROGRESSING" :
      return '审核中'
    case "PENDING_RETURN" :
      return '请退货'
    case "USER_RETURNED" :
      return '已退货'
    case "PENDING_REFUND" :
      return '退款中'
    case "REFUNDED" :
      return '退款成功'
    case "REJECT" :
      return '退款失败'
    default:
      return null
  }
}

export const getOrderStatusCode = status => {
  switch (status) {
    case 10:
      return "UNPAID";
    case 30:
      return "UNSEND";
    case 40:
      return "UNTAKE";
    case 75:
      return "REFUND_PROCESSING";
    default:
      return null
  }
}

//易点收支类型
export const getCoinType = (type) => {
  switch (type) {
    case "Income":
      return '易点充值';
    case "Outcome":
      return '订单支付';
    case "Drawback" :
      return '订单退款';
    default:
      return ''
  }
}

export const getPayMode = paymode => {
  switch (paymode) {
    case "YIWUCOIN":
      return "易物卡";
    default:
      return '';
  }
}

//活动名称
export const getActivityName = type => {
  switch (type) {
    case "TIME_LIMITATION":
      return "限时购";
    default:
      return '';
  }
}

//快递公司类型
export const getExpressType = expressCorp => {
  switch (expressCorp) {
    case "SF":
      return "shunfeng";
    case "JD":
      return "JD";
    case "YTO":
      return "yuantong";
    case "STO":
      return "shentong";
    case "YUNDAEX":
      return "yunda";
    case "BESTEX":
      return "huitongkuaidi";
    case "ZTO":
      return "zhongtong";
    case "QFKD":
      return "quanfengkuaidi";
    case "TTKDEX":
      return "tiantian";
    case "UCE":
      return "youshuwuliu";
    case "DEPPON":
      return "debangwuliu";
    case "HOAU":
      return "tiandihuayu";
    case "LBEX":
      return "longbanwuliu";
    case "YCG":
      return "yuanchengwuliu";
    case "ZENY":
      return "zengyisudi";
    case "SURE":
      return "sue";
    case "EMS":
      return "ems";
    case "ZJS":
      return "zhaijisong";
    case "GTO":
      return "guotongkuaidi";
    case "ND":
      return "ganzhongnengda";
    case "KJSD":
      return "kuaijiesudi";
    case "ANE":
      return "annengwuliu";
  }

}

//快递
export const changeExpressCorp = params => {
  switch (params) {
    case 'SF':
      return '顺丰快递';
    case 'JD':
      return '京东快递';
    case 'YTO':
      return '圆通快递';
    case 'STO':
      return '申通快递';
    case 'YUNDAEX':
      return '韵达快递';
    case 'BESTEX':
      return '百世汇通';
    case 'ZTO':
      return '中通快递';
    case 'QFKD':
      return '全峰快递';
    case 'TTKDEX':
      return '天天快递';
    case 'UCE':
      return '优速快递';
    case 'DEPPON':
      return '德邦物流';
    case 'HOAU':
      return '天地华宇';
    case 'LBEX':
      return '龙邦物流';
    case 'YCG':
      return '远成物流';
    case 'ZENY':
      return '增益速递';
    case 'SURE':
      return '速尔快递';
    case 'EMS':
      return 'EMS';
    case 'ZJS':
      return '宅急送';
    case 'GTO':
      return '国通快递';
    case 'ND':
      return '港中能达';
    case 'KJSD':
      return '快捷速递';
    case 'ANE':
      return '安能物流';
    default:
      return '';
  }
}

