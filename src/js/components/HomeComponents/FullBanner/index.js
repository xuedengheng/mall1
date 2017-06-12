/**
 * Created by Ben on 2016/12/12.
 */
import React, { Component } from 'react';
import { Carousel } from 'antd-mobile';
import { LazyLoadComponent } from 'components'

export default class FullBanner extends Component {
    render() {
        const { data, hackHeight, targetClick, ...setting } = this.props;
        let list;
        if (data.length === 1) {
            list =
                <div onClick={targetClick.bind(this, data[0].target, data[0].id)} className={hackHeight}>
                    <LazyLoadComponent>
                        <img src={data[0].url} className={"img-responsive " + hackHeight} style={{height: '100%'}}/>
                    </LazyLoadComponent>
                </div>
        } else {
            list =
                <Carousel {...setting}>
                    {
                        data.map((item, index) =>
                            <div key={index}  onClick={targetClick.bind(this, item.target, item.id)} className={hackHeight}>
                                <LazyLoadComponent>
                                    <img src={item.url} className="img-responsive" style={{height: '100%'}}/>
                                </LazyLoadComponent>
                            </div>
                        )
                    }
                </Carousel>
        }

        return (
            <div>
                {list}
            </div>
        )
    }

}