/**
 * Created by Ben on 2017/4/21.
 */
import React, {Component} from 'react'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import {SetHelmet, Loading} from 'components'
import {dateUtil, urlApi, fetchApi, checkoutTime, Constant, Tool, getQueryString} from 'service'
import styles from './index.scss'
import * as ActivityActions from 'actions/ActivityActions'

const DID = 'DID';
const ING = 'ING';
const WILL = 'WILL';

class PurchaseLimitYX extends Component {
  constructor(props) {
    super(props);
    this.state = {
      now: null,
      btnText: '进行中',
      statusText: '结束',
      dd: '00',
      hh: '00',
      mm: '00',
      ss: '00'
    }
  }

  componentDidMount() {
    this.getActivity();
  }

  componentWillReceiveProps(nextProps) {
    const {now, status, start, end, nextStart, timeList, activeIndex} = nextProps;
    let btnText = '';
    switch (status) {
      case DID:
        btnText = '已开始';
        break;
      case ING:
        btnText = '进行中';
        break;
      case WILL:
        btnText = '准时开启';
        break;
      default:
        break
    }
    this.setState({now, btnText});
    if (start && end && status && this.props.start !== start || this.props.end !== end || this.props.status !== status) {
      this.setInterval(status, start, end);
    }
    if (now && nextStart) {
      this.nextStartControl(now, nextStart)
    }
    if (this.props.timeList !== timeList || this.props.activeIndex !== activeIndex) {
      this.scrollTab(timeList, activeIndex)
    }
  }

  componentWillUnmount() {
    this.Timer && clearInterval(this.Timer);
    this.nextStartTimer && clearInterval(this.nextStartTimer);
  }

  scrollTab = (timeList, activeIndex) => {
    this.scrollTimer && clearTimeout(this.scrollTimer);
    this.scrollTimer = setTimeout(() => {
      const listLength = timeList.length;
      if (listLength < 5) return;
      const TabDom = document.querySelector(`.${styles.slideBox}`);
      TabDom.scrollLeft = TabDom.scrollWidth / listLength * (activeIndex <= 1 ? 0 : activeIndex - 2)
    }, 500)
  }

  getActivity = () => {
    this.Timer && clearInterval(this.Timer);
    this.props.activityActions.initActivity();
    this.props.activityActions.getTimelimitList(Constant.YX_APP);
  }

  nextStartControl = (now, nextStart) => {
    this.nextStartTimer && clearInterval(this.nextStartTimer);
    let startTime = new Date(now.replace(/-/g, '/')).getTime();
    let endTime = new Date(nextStart.replace(/-/g, '/')).getTime();
    this.nextStartTimer = setInterval(() => {
      let leftTime = endTime - startTime;
      if (!leftTime) {
        this.getActivity();
      }
      startTime += 1000;
    }, 1000)
  }

  setInterval = (status, start, end) => {
    this.Timer && clearInterval(this.Timer);
    let startTime = new Date(start.replace(/-/g, '/')).getTime();
    let endTime = new Date(end.replace(/-/g, '/')).getTime();
    this.Timer = setInterval(() => {
      let leftTime = endTime - startTime;
      if (!leftTime) {
        this.getActivity();
      }
      let dd = checkoutTime(parseInt(leftTime / 1000 / 60 / 60 / 24, 10));//计算剩余的天数
      let hh = checkoutTime(parseInt(leftTime / 1000 / 60 / 60 % 24, 10));//计算剩余的小时数
      let mm = checkoutTime(parseInt(leftTime / 1000 / 60 % 60, 10));//计算剩余的分钟数
      let ss = checkoutTime(parseInt(leftTime / 1000 % 60, 10));//计算剩余的秒数
      this.setState({
        statusText: status === WILL ? '开启' : '结束',
        dd,
        hh,
        mm,
        ss
      });
      startTime += 1000;
    }, 1000)
  }

  changeTab = (id, type, index) => {
    fetchApi.get({url: urlApi.system.now})
      .then(({result: now}) => {
        this.props.activityActions.initActivity();
        this.props.activityActions.getTimelimitDetail(id, now, type, index, null, null, Constant.YX_APP)
      })
  }

  _handleJump = productId => {
    const {search} = window.location;
    const channel = getQueryString(search, 'channel');
    if (channel === 'APP') {
      ewapp.nativeProductDetail(productId)
    } else {
      if (Tool.isWeiXin()) {
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.yiwu.quality';
      } else {
        window.location.hash = `#/yiwuapp_targetjump?target=product_detail&identity=${productId}`
      }
    }
  }

  render() {
    const {isFetching, ongoing, activeIndex, now, timeList, productList} = this.props;
    const {btnText, statusText, dd, hh, mm, ss} = this.state;
    const slideWidth = timeList.length > 5 ? 20 : 100 / timeList.length;
    const slideStyles = {
      width: slideWidth + 'vw',
      transform: `translate3d(${slideWidth * activeIndex}vw, 0, 0)`
    }
    return (
      <div className={styles.root}>
        <SetHelmet title="限时购" keywords="研选限时购－优惠享不停"/>
        {
          isFetching && <Loading />
        }
        <div className="fixed-top" id="fixedTopHeader">
          <div className={styles.statusWrapper}>
            <div className={styles.slideBox}>
              <ul className={styles.statusContent}
                  style={{width: (timeList.length > 5 ? 20 : 100 / timeList.length) * timeList.length + 'vw'}}>
                <div className={styles.slideBlock} style={slideStyles}/>
                {
                  timeList.map((time, index) => {
                    let status;
                    if (index < ongoing) {
                      status = {
                        type: DID,
                        text: '已开始'
                      }
                    } else if (index > ongoing) {
                      status = {
                        type: WILL,
                        text: '准时开启'
                      }
                    } else {
                      status = {
                        type: ING,
                        text: '进行中'
                      }
                    }
                    return (
                      <li className={`${styles.content} ${index === activeIndex ? styles.active : ''}`} key={time.id}
                          onClick={this.changeTab.bind(this, time.id, status.type, index)}>
                        <p className={styles.time}>{dateUtil.getActivityTime(time.start, now)}</p>
                        <p className={styles.status}>{status.text}</p>
                      </li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
        </div>
        <div style={{height: '1.1rem'}}/>
        <div className={styles.bannerWrapper}>
          <img className={styles.banner} src={require('../../../../images/activity/purchaseLimit/yxbanner.png')}
               alt=""/>
        </div>
        <div className={styles.timerWrapper}>
          距{statusText}还有&nbsp;&nbsp;
          <span className={styles.rect}>{dd}</span>&nbsp;&nbsp;天&nbsp;&nbsp;
          <span className={styles.rect}>{hh}</span>&nbsp;&nbsp;:&nbsp;&nbsp;
          <span className={styles.rect}>{mm}</span>&nbsp;&nbsp;:&nbsp;&nbsp;
          <span className={styles.rect}>{ss}</span>
        </div>
        <div className={styles.productContainer}>
          <ul className={styles.productWrapper}>
            {
              productList.products &&
              productList.products.map((product, index) => {
                let activityPrices = product.skus.map(sku => sku.activityPrice);
                let salePrices = product.skus.map(sku => sku.salePrice);
                return (
                  <li key={index}>
                    <div className={styles.productContent} onClick={this._handleJump.bind(this, product.code)}>
                      <div className={styles.product}>
                        <div className={styles.picture}>
                          <img src={product.picture} className="img-responsive" alt="" style={{width: '100%'}}/>
                        </div>
                        <div className={styles.content}>
                          <div className={styles.desc}>
                            <p className={`text-overflow-1 ${styles.name}`}>
                              {product.name}
                            </p>
                            <p className={`text-overflow-1 ${styles.tip}`}>
                              {product.description}
                            </p>
                          </div>
                          <div className={styles.detail}>
                            <p className={styles.priceWrapper}>
                              <span className={styles.price}>¥{Math.min.apply(null, activityPrices).toFixed(2)}</span>
                              <s className={styles.originPrice}>¥{Math.min.apply(null, salePrices).toFixed(2)}</s>
                            </p>
                            <p className={styles.limitCount}>
                              {
                                product.buyUpNum !== 2147483647 &&
                                `限购${product.buyUpNum}件`
                              }
                            </p>
                          </div>
                        </div>
                      </div>
                      <button className={styles.statusBtn}>{btnText}</button>
                    </div>
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.activity.isFetching,
  status: state.activity.status,
  now: state.activity.now,
  start: state.activity.start,
  end: state.activity.end,
  nextStart: state.activity.nextStart,
  activeIndex: state.activity.activeIndex,
  ongoing: state.activity.ongoing,
  timeList: state.activity.timeLimitedList,
  productList: state.activity.timeLimitedDetail,
  countdownValue: state.activity.countdownValue
})

const mapDispatchToProps = dispatch => ({
  activityActions: bindActionCreators(ActivityActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PurchaseLimitYX)

