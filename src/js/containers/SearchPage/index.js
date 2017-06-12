/**
 * Created by Ben on 2016/12/12.
 */
import React, {Component} from 'react';
import {hashHistory} from 'react-router'
import styles from './index.scss'
import {SearchInput, SearchHistory, SetHelmet} from 'components'
import {connect} from 'react-redux'

class SearchPage extends Component {

  render() {
    return (
      <div className={styles.root}>
        <SetHelmet title="搜索"/>
        <SearchInput back={this.back} search={this.search}/>
        <div className="pt20" />
        <div className={styles.historyWrapper}>
          <SearchHistory search={this.search}/>
        </div>
      </div>
    )
  }

  search = (value) => {
    hashHistory.push(`/list?names=${encodeURIComponent(value)}`)
  }

  back = () => {
    hashHistory.goBack()
  }
}

const mapStateToProps = state => ({
  state
})

export default connect(
  mapStateToProps
)(SearchPage)