/**
 * Created by yiwu on 2017/2/17.
 */
import React, {Component} from 'react'
import {GoBack, Loading, HeaderNode, FooterNode, SetHelmet} from 'components';
import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import ReactPullLoad, {STATS} from 'react-pullload'
import {Tabs, Toast} from 'antd-mobile'
import * as WalletActions from 'actions/WalletActions'
import {urlApi, fetchApi, dateUtil, Tool} from 'service'
import {Link} from 'react-router'
import styles from './index.scss'

const TabPane = Tabs.TabPane;
const INCOME = 0;
const OUTCOME = 1;
const AND = true;

class Coin extends Component {
  state = {
    incomeData: [],
    outcomeData: [],
    income: [],
    outcome: [],
    incomePage: 0,
    outcomePage: 0,
    incomeHasMore: true,
    outcomeHasMore: true,
    incomeAction: STATS.init,
    outcomeAction: STATS.init
  }

  componentDidMount() {
    this.props.walletActions.queryWallet(AND);
  }

  componentWillReceiveProps(nextProps) {
    let incomeData = [];
    let outcomeData = [];
    let income = [];
    let outcome = [];
    if (nextProps.income.length > 0) {
      incomeData = nextProps.income;
      income = this.classifyHistory(nextProps.income);
    }
    if (nextProps.outcome.length > 0) {
      outcomeData = nextProps.outcome;
      outcome = this.classifyHistory(nextProps.outcome);
    }
    this.setState({incomeData, income, outcomeData, outcome});
  }

  componentWillUnmount() {
    this.props.walletActions.initWallet()
  }

  classifyHistory = (history) => {
    let map = {};
    history.map(item => {
      let date = item.operateTime.split(' ')[0];
      if (!map[date]) {
        let array = [];
        array.push(item);
        map[date] = {date: dateUtil.turnToYMD(date), data: array}
      } else {
        let temp = map[date];
        temp.data.push(item);
        map[date] = temp;
      }
    })

    let result = [];
    for (let key in map) {
      result.push(map[key]);
    }
    return result;
  }

  getData = (type, status, pageNo) => {
    const {incomeData, outcomeData} = this.state;
    let income = type === INCOME;
    let params = income ?
      [
        {
          types: 'Drawback'
        },
        {
          account: localStorage.account,
          types: 'Income',
          pageNumber: pageNo === 0 ? '0' : pageNo,
          pageSize: 10
        }
      ] :
      {
        account: localStorage.account,
        types: 'Outcome',
        pageNumber: pageNo === 0 ? '0' : pageNo,
        pageSize: 10
      };
    let url = urlApi.wallet.journal + Tool.setSearchParams(params);
    fetchApi.get({url})
      .then(json => {
        if (json.success) {
          if (income) {
            const incomeHasMore = json.total > incomeData.length;
            const data = status ? json.history : [...incomeData, ...json.history];
            const income = this.classifyHistory(data);
            this.setState({
              income,
              incomeHasMore,
              incomeData: data,
              incomeAction: status ? STATS.refreshed : STATS.reset
            })
          } else {
            const outcomeHasMore = json.total > outcomeData.length;
            const data = status ? json.history : [...outcomeData, ...json.history];
            const outcome = this.classifyHistory(data);
            this.setState({
              outcome,
              outcomeHasMore,
              outcomeData: data,
              outcomeAction: status ? STATS.refreshed : STATS.reset
            })
          }
        } else {
          Toast.info(json.msg);
          if (income) {
            this.setState({
              incomeHasMore: true,
              incomeAction: status ? STATS.refreshed : STATS.reset
            })
          } else {
            this.setState({
              outcomeHasMore: true,
              outcomeAction: status ? STATS.refreshed : STATS.reset
            })
          }
        }
      }).catch(e => {
      Toast.info("网络请求失败，请检查您的网络");
      if (income) {
        this.setState({
          incomeHasMore: true,
          incomeAction: status ? STATS.refreshed : STATS.reset
        })
      } else {
        this.setState({
          outcomeHasMore: true,
          outcomeAction: status ? STATS.refreshed : STATS.reset
        })
      }
    })
    if (income) {
      this.setState({
        incomePage: parseInt(pageNo) > 0 ? pageNo : 0,
        incomeAction: status ? STATS.refreshing : STATS.loading
      })
    } else {
      this.setState({
        outcomePage: parseInt(pageNo) > 0 ? pageNo : 0,
        outcomeAction: status ? STATS.refreshing : STATS.loading
      })
    }
  }

  handleAction(type, action) {
    if (type === INCOME) {
      if (action === this.state.incomeAction) return false;
      if (action === STATS.refreshing) {
        this.handRefreshing(type)
      } else if (action === STATS.loading) {
        this.handLoadMore(type)
      } else {
        this.setState({incomeAction: action})
      }
    } else {
      if (action === this.state.outcomeAction) return false;
      if (action === STATS.refreshing) {
        this.handRefreshing(type)
      } else if (action === STATS.loading) {
        this.handLoadMore(type)
      } else {
        this.setState({outcomeAction: action})
      }
    }
  }

  handRefreshing(type) {
    this.getData(type, true, 0);
  }

  handLoadMore(type) {
    if (type === INCOME && this.state.incomeHasMore) {
      this.getData(type, false, this.state.incomePage + 1)
    } else if (type === OUTCOME && this.state.outcomeHasMore) {
      this.getData(type, false, this.state.outcomePage + 1)
    }
  }

  render() {
    const {isFetching, wallet, incomeEmpty, outcomeEmpty} = this.props;
    const {income, outcome, incomeAction, outcomeAction, incomeHasMore, outcomeHasMore} = this.state;
    return (
      <div>
        <SetHelmet title="我的易点"/>
        {isFetching && <Loading />}
        <GoBack name="我的易点"/>
        <div>
          <div style={{height: '1.84rem'}}/>
          <div className={`ver-center bg-orange ${styles.topCon}`}>
            <div className={`center-center ${styles.leftCon}`}>
              <span className="font-32 ">总计</span>
            </div>
            <div className={`center-center ${styles.rightCon}`}>
                        <span
                          className="font-48">{(wallet.balance && parseFloat(wallet.balance) > 0) ?
                          wallet.balance.toFixed(2) : '0.00'}</span>
            </div>
          </div>
        </div>
        <Tabs defaultActiveKey="1" swipeable={false} destroyInactiveTabPane={true} className="coin-tabs">
          <TabPane tab="收入" key="1">
            {
              !incomeEmpty ?
                <ReactPullLoad downEnough={150}
                               action={incomeAction}
                               handleAction={this.handleAction.bind(this, INCOME)}
                               hasMore={incomeHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={FooterNode}
                               style={{overflowY: 'initial'}}>
                  {
                    income && income.map((item, index) =>
                      <div className={styles.historyWapper} key={index}>
                        <p className={styles.title}>{item.date}</p>
                        <div>
                          {
                            item.data && item.data.map((data, index) =>
                              <Link
                                to={`/mine/coin/${data.type}/${data.sequenceId}`}
                                className={styles.historyItem} key={index}>
                                <div className={styles.detail}>
                                  <div className={styles.icon}>
                                    <img width={40} height={40}
                                         src={require(`../../../../images/mine/yiwucoin/yidian_icon_${data.type === 'Drawback' ? 'return' : 'charge'}.png`)}/>
                                  </div>
                                  <div className={styles.price}>
                                    <p className={styles.amount}>+{parseFloat(data.amount).toFixed(2)}</p>
                                    <p className={styles.remark}>{data.type === 'Drawback' ? '订单退款' : '易物卡充值'}</p>
                                  </div>
                                </div>
                                <div className={styles.time}>
                                  {dateUtil.getTime(data.operateTime)}
                                </div>
                              </Link>
                            )
                          }
                        </div>
                      </div>
                    )
                  }
                </ReactPullLoad>
                :
                <div className="empty-box" style={{marginTop: '3.15rem'}}>
                  <div className="pic">
                    <img src={require('../../../../images/mine/mine_card_icon_nocard.png')} alt=""/>
                  </div>
                  <p className="text">暂无流水记录</p>
                </div>
            }

          </TabPane>
          <TabPane tab="支出" key="2">
            {
              !outcomeEmpty ?
                <ReactPullLoad downEnough={150}
                               action={outcomeAction}
                               handleAction={this.handleAction.bind(this, OUTCOME)}
                               hasMore={outcomeHasMore}
                               distanceBottom={100}
                               HeadNode={HeaderNode}
                               FooterNode={FooterNode}
                               style={{overflowY: 'initial'}}>
                  {
                    outcome && outcome.map((item, index) =>
                      <div className={styles.historyWapper} key={index}>
                        <p className={styles.title}>{item.date}</p>
                        <ul>
                          {
                            item.data && item.data.map((data, index) =>
                              <Link
                                to={`/mine/coin/${data.type}/${data.sequenceId}`}
                                className={styles.historyItem} key={index}>
                                <div className={styles.detail}>
                                  <div className={styles.icon}>
                                    <img width={40} height={40}
                                         src={require('../../../../images/mine/yiwucoin/yidian_icon_order.png')}/>
                                  </div>
                                  <div className={styles.price}>
                                    <p className={styles.amount}>-{parseFloat(data.amount).toFixed(2)}</p>
                                    <p className={styles.remark}>{data.remark}</p>
                                  </div>
                                </div>
                                <div className={styles.time}>
                                  {dateUtil.getTime(data.operateTime)}
                                </div>
                              </Link>
                            )
                          }
                        </ul>
                      </div>
                    )
                  }
                </ReactPullLoad>
                :
                <div className="empty-box" style={{marginTop: '3.15rem'}}>
                  <div className="pic">
                    <img src={require('../../../../images/mine/mine_card_icon_nocard.png')} alt=""/>
                  </div>
                  <p className="text">暂无流水记录</p>
                </div>
            }

          </TabPane>
        </Tabs>
      </div>
    )
  }
}
const mapStateToProps = state => ({
  isFetching: state.wallet.isFetching,
  wallet: state.wallet.wallet,
  income: state.wallet.income,
  outcome: state.wallet.outcome,
  incomeEmpty: state.wallet.incomeEmpty,
  outcomeEmpty: state.wallet.outcomeEmpty
})

const mapDispatchToProps = dispatch => ({
  walletActions: bindActionCreators(WalletActions, dispatch)
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Coin)