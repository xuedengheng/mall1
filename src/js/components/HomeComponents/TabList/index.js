/**
 * Created by Ben on 2016/12/9.
 */
import React, {Component} from 'react';
import styles from './index.scss'

export default class TabList extends Component {

  render() {
    const {list, handleClick, showcaseId} = this.props;
    const isShowcase = _.findIndex(list, item => item.showcaseId === showcaseId)
    const showcaseIndex = isShowcase > -1 ? isShowcase : 0
    let view = [];
    if (isShowcase > -1) {
      list.map((item, index) => {
        if (index === isShowcase) {
          view.push(
            <li onClick={() => {
              handleClick(item.showcaseId);
            }}
                key={item.showcaseId}
                style={{'color': '#fc6c26'}}>
              {item.showcaseName}
            </li>
          )
        } else {
          view.push(
            <li onClick={() => {
              handleClick(item.showcaseId);
            }} key={item.showcaseId}>
              {item.showcaseName}
            </li>
          )
        }
      })
    } else {
      list.map((item, index) => {
        if (index === 0) {
          view.push(
            <li onClick={() => {
              handleClick(item.showcaseId);
            }}
                key={item.showcaseId}
                style={{'color': '#fc6c26'}}>
              {item.showcaseName}
            </li>
          )
        } else {
          view.push(
            <li onClick={() => {
              handleClick(item.showcaseId);
            }} key={item.showcaseId}>
              {item.showcaseName}
            </li>
          )
        }
      })
    }
    return (
      <div className={`bg-white ${styles.scrollBox}`}>
        <ul style={{width: 1.6 * list.length + 0.2 + 'rem'}}>
          <div className={styles.activeLi}
               style={{'transform': 'translateX(' + showcaseIndex * 1.6 + 'rem) scale(.8)'}}/>
          {view}
        </ul>
      </div>
    )
  }
}