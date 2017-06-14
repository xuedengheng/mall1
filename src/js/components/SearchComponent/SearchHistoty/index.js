/**
 * Created by Ben on 2016/12/12.
 */
import React, {Component} from 'react';
import {ConfirmModal} from 'components';
import styles from './index.scss';

const DeleteTips = {
  tips: '是否清空搜索记录',
  confirmBtnText: '是',
  cancelBtnText: '否'
}
export default class SearchHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      historyItems: [],
      visible: false
    }
  }

  componentDidMount() {
    this.initHistoryItems();
  }

  initHistoryItems = () => {
    const {historyItems} = localStorage;
    if (historyItems) {
      this.setState({
        historyItems: historyItems.split('|')
      })
    } else {
      this.setState({
        historyItems: []
      })
    }
  }

  onCancel = () => {
    this.setState({visible: false});
  }

  onConfirm = () => {
    localStorage.removeItem('historyItems');
    this.initHistoryItems();
    this.setState({visible: false});
  }

  deleteHistorys = () => {
    this.setState({visible: true});
  }

  render() {
    const {historyItems, visible} = this.state;
    const {search} = this.props;
    const TIPS = DeleteTips;
    return (
      <div className={styles.root}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <span className={`ver-center ${styles.imgSpan}`}>
              <img className="img-responsive"
                   src={require('../../../../images/home/searchPage/search_icon_searchhistory.png')}
                   alt=""/>
            </span>
            <span>
              搜索历史
            </span>
          </div>
          <div className={styles.headerRight} onClick={::this.deleteHistorys}>
            <span className="ver-center">
              <img className="img-responsive"
                   src={require('../../../../images/home/searchPage/search_icon_delete.png')} alt=""/>
            </span>
          </div>
        </div>
        {
          historyItems ? historyItems.map((item, index) =>
              <div className={styles.container} key={index} onClick={search.bind(this, item)}>
                <div className={styles.list}>
                  <div className={styles.listLeft}>
                    <span className={`ver-center ${styles.imgSpan}`}>
                      <img className="img-responsive"
                           src={require('../../../../images/home/searchPage/search_icon_historyclock.png')}
                           alt=""/>
                    </span>
                    <span>{item}</span>
                  </div>
                  <div className={styles.listRight}>
                    <span className="ver-center">
                      <img className="img-responsive"
                           src={require('../../../../images/home/searchPage/search_icon_arrowright.png')}
                           alt=""/>
                    </span>
                  </div>
                </div>
              </div>
            ) : null
        }
        <ConfirmModal
          visible={visible}
          tips={TIPS.tips}
          confirmBtnText={TIPS.confirmBtnText}
          cancelBtnText={TIPS.cancelBtnText}
          onCancel={this.onCancel.bind(this)}
          onConfirm={this.onConfirm.bind(this)}/>
      </div>
    )

  }
}