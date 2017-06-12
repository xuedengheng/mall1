/**
 * Created by Ben on 2017/2/16.
 */
import React from 'react';
import LazyLoad from 'react-lazyload'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const LazyLoadComponent = props => {
    return (
        <LazyLoad throttle={200} height={100}>
            <ReactCSSTransitionGroup key="1"
                                     transitionName="fade"
                                     transitionAppear={true}
                                     transitionAppearTimeout={500}
                                     transitionEnter={false}
                                     transitionLeave={false} >
                {props.children}
            </ReactCSSTransitionGroup>
        </LazyLoad>
    )
}

export default LazyLoadComponent;