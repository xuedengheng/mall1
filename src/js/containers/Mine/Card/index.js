/**
 * Created by yiwu on 2017/2/20.
 */
import React, {Component} from 'react';
import {Link} from 'react-router'
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import * as EwuCardActions from 'actions/EwuCardActions'
import {GoBack, Loading, HeaderNode, FooterNode, SetHelmet} from 'components';
import ReactPullLoad, {STATS} from 'react-pullload'
import {Tabs, Toast} from 'antd-mobile'
import {urlApi, fetchApi, Tool} from 'service'
import styles from './index.scss'

const TabPane = Tabs.TabPane;
const PURCHASED = 0;
const APPLIED = 1;

class Card extends Component {
  state = {
    purchased: [],
    applied: [],
    purchasedPage: 0,
    appliedPage: 0,
    purchasedHasMore: true,
    appliedHasMore: true,
    purchasedAction: STATS.init,
    appliedAction: STATS.init
  }

  componentDidMount() {
    this.props.ewuCardActions.queryCard();
  }

  componentWillReceiveProps(nextProps) {
    const {purchased, applied} = nextProps;
    this.setState({
      purchased,
      applied
    })
  }

  componentWillUnmount() {
    this.props.ewuCardActions.initCard()
  }

  getData = (type, status, pageNo) => {
    const {purchased, applied} = this.state;
    let isPurchased = type === PURCHASED;
    let url = isPurchased ?
      `${urlApi.card.query}/Purchased/purchasedBy/${localStorage.account}/${pageNo}/10` :
      `${urlApi.card.query}/Applied/purchasedBy/${localStorage.account}/${pageNo}/10`;
    fetchApi.get({url})
      .then(json => {
        if (json.success) {
          if (isPurchased) {
            const hasMore = json.total > purchased.length;
            const data = status ? json.cards : [...purchased, ...json.cards];
            this.setState({
              purchased: data,
              purchasedHasMore: hasMore,
              purchasedAction: status ? STATS.refreshed : STATS.reset
            })
          } else {
            const hasMore = json.total > applied.length;
            const data = status ? json.cards : [...applied, ...json.cards];
            this.setState({
              applied: data,
              appliedHasMore: hasMore,
              appliedAction: status ? STATS.refreshed : STATS.reset
            })
          }
        } else {
          Toast.info(json.msg);
          if (isPurchased) {
            this.setState({
              purchasedHasMore: true,
              purchasedAction: status ? STATS.refreshed : STATS.reset
            })
          } else {
            this.setState({
              appliedHasMore: true,
              appliedAction: status ? STATS.refreshed : STATS.reset
            })
          }
        }
      }).catch(e => {
      Toast.info("网络请求失败，请检查您的网络");
      if (isPurchased) {
        this.setState({
          purchasedHasMore: true,
          purchasedAction: status ? STATS.refreshed : STATS.reset
        })
      } else {
        this.setState({
          appliedHasMore: true,
          appliedAction: status ? STATS.refreshed : STATS.reset
        })
      }
    })
    if (isPurchased) {
      this.setState({
        purchasedPage: parseInt(pageNo) > 0 ? pageNo : 0,
        purchasedAction: status ? STATS.refreshing : STATS.loading
      })
    } else {
      this.setState({
        appliedPage: parseInt(pageNo) > 0 ? pageNo : 0,
        appliedAction: status ? STATS.refreshing : STATS.loading
      })
    }
  }

  handleAction(type, action) {
    if (type === PURCHASED) {
      if (action === this.state.purchasedAction) return false;
      if (action === STATS.refreshing) {
        this.handRefreshing(type)
      } else if (action === STATS.loading) {
        this.handLoadMore(type)
      } else {
        this.setState({purchasedAction: action})
      }
    } else {
      if (action === this.state.appliedAction) return false;
      if (action === STATS.refreshing) {
        this.handRefreshing(type)
      } else if (action === STATS.loading) {
        this.handLoadMore(type)
      } else {
        this.setState({appliedAction: action})
      }
    }
  }

  handRefreshing(type) {
    this.getData(type, true, 0);
  }

  handLoadMore(type) {
    if (type === PURCHASED && this.state.purchasedHasMore) {
      this.getData(type, false, this.state.purchasedPage + 1)
    } else if (type === APPLIED && this.state.appliedHasMore) {
      this.getData(type, false, this.state.appliedPage + 1)
    }
  }

  render() {
    const {isFetching, purchasedEmpty, appliedEmpty} = this.props;
    const {purchased, applied, purchasedHasMore, appliedHasMore, purchasedAction, appliedAction} = this.state;
    return (
      <div>
        <SetHelmet title="我的易物卡"/>
        {isFetching && <Loading />}
        <GoBack name="我的易物卡" bottom="true"/>
        <Tabs defaultActiveKey="1" swipeable={false} destroyInactiveTabPane={true} onChange={this.getApplied}
              className="card-tabs">
          <TabPane tab="未使用" key="1">
            {
              !purchasedEmpty ?
                <ReactPullLoad downEnough={150}
                               action={purchasedAction}
                               handleAction={this.handleAction.bind(this, PURCHASED)}
                               hasMore={purchasedHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={FooterNode}
                               style={{overflowY: 'initial'}}>
                  <div className={styles.cardWrapper}>
                    <ul>
                      {
                        purchased.map((item, index) =>
                          <Link to={`/mine/card/detail/${item.cardId}`}
                                className={styles.cardItem}
                                key={index}>
                            <img
                              src={require(`../../../../images/mine/yiwuCard/mine_card_icon_${item.amount}.png`)}
                              alt=""/>
                          </Link>
                        )
                      }
                    </ul>
                  </div>
                </ReactPullLoad>
                :
                <div className="empty-box" style={{marginTop: '3.15rem'}}>
                  <div className="pic">
                    <img src={require('../../../../images/mine/mine_card_icon_nocard.png')} alt=""/>
                  </div>
                  <p className="text">暂无相关易物卡</p>
                </div>
            }
          </TabPane>
          <TabPane tab="已使用" key="2">
            {
              !appliedEmpty ?
                <ReactPullLoad downEnough={150}
                               action={appliedAction}
                               handleAction={this.handleAction.bind(this, APPLIED)}
                               hasMore={appliedHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={FooterNode}
                               style={{overflowY: 'initial'}}>
                  <div className={styles.cardWrapper}>
                    <ul>
                      {
                        applied.map((item, index) =>
                          <Link to={`/mine/card/detail/${item.cardId}`}
                                className={styles.cardItem}
                                key={index}>
                            <img
                              src={require(`../../../../images/mine/yiwuCard/mine_card_icon_${item.amount}.png`)}
                              alt=""/>
                          </Link>
                        )
                      }
                    </ul>
                  </div>
                </ReactPullLoad>
                :
                <div className="empty-box" style={{marginTop: '3.15rem'}}>
                  <div className="pic">
                    <img src={require('../../../../images/mine/mine_card_icon_nocard.png')} alt=""/>
                  </div>
                  <p className="text">暂无相关易物卡</p>
                </div>
            }
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  isFetching: state.ewuCard.isFetching,
  purchased: state.ewuCard.purchased,
  applied: state.ewuCard.applied,
  purchasedEmpty: state.ewuCard.purchasedEmpty,
  appliedEmpty: state.ewuCard.appliedEmpty
})

const mapDispatchToProps = dispatch => ({
  ewuCardActions: bindActionCreators(EwuCardActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Card)