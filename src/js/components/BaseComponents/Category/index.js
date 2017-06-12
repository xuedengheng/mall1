/**
 * Created by Ben on 2017/1/3.
 */
import React from 'react'
import {Link, hashHistory} from 'react-router'
import styles from './index.scss'
import {api} from 'service'
import {LazyLoadComponent} from 'components'


class Category extends React.Component {

  handleClick = (id,title) => {
    hashHistory.push(`/list?catalogIds=${id}&title=${title}`)
  }

  render() {
    const {data, margin, targetClick, from, id} = this.props
    let grid = [];
    if (from && !id) {
      grid.push(
        <p className={`text-center color000 font-26 ${styles.name}`} key="title">
          <img src={require('../../../../images/base/search_class_icon.png')} alt=""/>
          商品类目
        </p>
      )
    }
    data.map((item, index) => {
      if (item.target) {
        grid.push(
          <div
            key={index}
            onClick={targetClick.bind(this, item.target, item.id, item.title)}
            className={`center-center-column ${styles.panel}`}
            style={{margin: `${margin}rem 0`}}>
            <LazyLoadComponent>
              <img
                src={item.url}
                alt=""
                className={styles.thumb}
              />
            </LazyLoadComponent>
            <p className={styles.title}>
              {item.title}
            </p>
          </div>
        )
      } else if (item.categoryInfos) {
        if (item.categoryInfos.length > 0) {
          grid.push(
            <div key={index}>
              <p className={`text-center color000 font-26 ${styles.name}`}>
                <img src={require('../../../../images/base/search_class_icon.png')} alt=""/>
                {item.categoryName}
              </p>
              {
                item.categoryInfos.map((info, index) =>
                  <div
                    key={index}
                    className={`center-center-column ${styles.panel}`}
                    style={{margin: `${margin}rem 0`}}
                    onClick={this.handleClick.bind(this, info.categoryId, info.categoryName)}>
                    <LazyLoadComponent>
                      <img src={info.picture} className={styles.thumb}/>
                    </LazyLoadComponent>
                    <p className={`text-overflow-1 ${styles.title}`}>{info.categoryName}</p>
                  </div>
                )
              }
            </div>
          )
        }
      } else {
        grid.push(
          <Link
            key={index}
            className={`center-center-column ${styles.panel}`}
            style={{margin: `${margin}rem 0`}}
            to={`/catelog/${item.categoryId}`}>
            <img src={item.picture} className={styles.thumb}/>
            <p className={`text-overflow-1 ${styles.title}`}>{item.categoryName}</p>
          </Link>
        )
      }
    })

    return (
      <div className={styles.root}>
        {grid}
      </div>
    )
  }

}


export default Category