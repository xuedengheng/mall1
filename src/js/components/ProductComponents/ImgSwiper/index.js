/**
 * Created by Ben on 2016/12/13.
 */
import React from 'react';
import {Carousel} from 'antd-mobile';
import styles from './index.scss'
import {LazyLoadComponent} from 'components'

const ImgSwiper = ({pictureUrls, picture, ...settings}) => {
  let list;
  if (pictureUrls && pictureUrls.length === 1) {
    list =
      <div className={styles.imgDiv}>
        <LazyLoadComponent>
          <img src={pictureUrls[0]} className="img-responsive"/>
        </LazyLoadComponent>
      </div>
  } else if (pictureUrls && pictureUrls.length > 1) {
    list =
      <Carousel {...settings}>
        {
          pictureUrls.map((item, index) =>
            <div key={index} className={styles.imgDiv}>
              <LazyLoadComponent>
                <img src={item} className="img-responsive"/>
              </LazyLoadComponent>
            </div>
          )
        }
      </Carousel>
  } else if (pictureUrls && picture && pictureUrls.length === 0) {
    list =
      <div>
        <LazyLoadComponent>
          <img src={picture} className="img-responsive"/>
        </LazyLoadComponent>
      </div>
  }
  return (
    <div className={styles.root}>
      {list}
    </div>
  )
};

export default ImgSwiper