/**
 * Created by Ben on 2016/12/13.
 */
import React, {Component} from 'react';
import {api} from 'service'
import styles from './index.scss';

const DetailFont = props => {
  const {name, price, originPrice, sellCount} = props;
  return (
    <div className={styles.root}>
      <div className={styles.title}>
                    <span>
                        {name}
                    </span>
      </div>
      <div className={styles.container}>
        <div>
          <span className="font-20 color000">¥ </span>
          <span className="font-40 color000" style={{marginRight: '.1rem'}}>{price}</span>
          {
            price !== originPrice ?
              <span className="font-20 color333 line-throught">¥ {originPrice}</span>
              : null
          }
          <p className="font-20 color333">{sellCount}人已选</p>
        </div>
      </div>
    </div>
  )
};


export default DetailFont;