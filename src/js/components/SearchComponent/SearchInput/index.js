/**
 * Created by Ben on 2016/12/12.
 */
import React, {Component} from 'react';
import styles from './index.scss'



class SearchInput extends Component {
  state = {
    isEmpty: true,
    mySearch: '',
  }

  componentDidMount() {
    this.refs.search.focus();
  }

  valueChange = (e) => {
    if (e.target.value) {
      this.setState({mySearch: e.target.value, isEmpty: false});
    } else {
      this.setState({mySearch: e.target.value, isEmpty: true});
    }
  }

  inputPress = (e) => {
    const {mySearch}=this.state;
    if (e.which == "13") {
      if (mySearch) {
        this.search();
      } else {
        return;
      }
    }
  }

  search = () => {
    this.refs.search.blur();
    let {value} = this.refs.search;
    value = value.trim();
    let {historyItems} = localStorage;
    if (historyItems === undefined) {
      localStorage.historyItems = value;
    } else {
      const onlyItem = historyItems.split('|').filter(e => e != value);
      if (onlyItem.length > 0) historyItems = value + '|' + onlyItem.join('|');
      localStorage.historyItems = historyItems;
    }
    this.props.search(value);
  }

  render() {
    const {mySearch, isEmpty}=this.state;
    return (
      <div className={styles.root}>
        <div className={styles.searchInput}>
          <span className="ver-center">
            <img src={require("../../../../images/home/searchPage/search_icon_searchhistory.png")} alt=""/>
          </span>
          <input type="search" ref="search" value={mySearch} placeholder="商品名 品牌 分类"
                 onChange={this.valueChange.bind(this)} onKeyUp={this.inputPress.bind(this)}/>
        </div>
        {
          isEmpty ?
            <div onClick={this.props.back} className={styles.cancel}>取消</div> :
            <div onClick={this.search.bind(this)} className={styles.cancel}>搜索</div>
        }
      </div>
    )
  }
}

export default SearchInput