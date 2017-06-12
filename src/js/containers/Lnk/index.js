/**
 * Created by Ben on 2017/5/31.
 */
import React, {Component} from 'react';
import {getQueryString} from 'service'
import {SetHelmet} from 'components'
import styles from './index.scss'

class Lnk extends Component {
  constructor(props) {
    super(props)
    const {search} = props.location;
    const url = search ? getQueryString(search, 'url') ? decodeURIComponent(getQueryString(search, 'url')) : '' : '';
    this.state = {url}
  }

  render() {
    const {query} = this.props.location;
    return (
      <div className={styles.lnkWrap}>
        <SetHelmet title={query.title ? query.title : ''}/>
        <iframe src={this.state.url}
                className={styles.frame}
                width={window.innerWidth}
                height={window.innerHeight}/>
      </div>
    )
  }
}

export default Lnk