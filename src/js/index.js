import React from 'react'
// import 'react-fastclick'
import 'babel-polyfill'
import {AppContainer} from 'react-hot-loader'
import {render} from 'react-dom'
import {hashHistory} from 'react-router'
import Root from './containers/Root'
import configureStore from './store/configureStore'
import rootSage from './sagas'
import {Tool, getQueryString} from 'service'

const {search, origin, pathname, hash, href} = window.location;
const openHrefArr = href.split('openId=');
const openHashArr = hash.split(/[&|?]openId=/);
if (Tool.isWeiXin()) {
  if (openHrefArr.length === 2 && !localStorage.openId) {
    localStorage.setItem('openId', openHrefArr[1]);
    window.location.replace(origin + pathname + '?yiwu=weixin' + openHashArr[0])
  } else {
    if (!localStorage.getItem('openId')) {
      window.location.replace(Tool.generateGetCodeUrl(window.location.href))
    } else if (!getQueryString(search, 'yiwu')) {
      window.location.replace(origin + pathname + '?yiwu=weixin' + openHashArr[0])
    }
  }
}

const RedBox = require('redbox-react').default;
const rootEl = document.getElementById('app');
const store = configureStore(window.__INITIAL_STATE__);
store.runSaga(rootSage);

try {
  render(
    <AppContainer>
        <Root store={store} history={hashHistory}/>
    </AppContainer>,
    rootEl
  )
} catch (e) {
  render(
    <RedBox error={e}>
        <AppContainer>
            <Root store={store} history={hashHistory}/>
        </AppContainer>
    </RedBox>,
    rootEl
  )
}

if (module.hot) {
  /**
   * Warning from React Router, caused by react-hot-loader.
   * The warning can be safely ignored, so filter it from the console.
   * Otherwise you'll see it every time something changes.
   * See https://github.com/gaearon/react-hot-loader/issues/298
   */
  const orgError = console.error; // eslint-disable-line no-console
  console.error = (message) => { // eslint-disable-line no-console
    if (message && message.indexOf('You cannot change <Router routes>;') === -1) {
      // Log the error as normally
      orgError.apply(console, [message]);
    }
  };
  module.hot.accept('./containers/Root', () => {
    // If you use Webpack 2 in ES modules mode, you can
    // use <App /> here rather than require() a <NextApp />.
    const NextApp = require('./containers/Root').default;
    try {
      render(
        <AppContainer>
            <NextApp store={store} history={hashHistory}/>
        </AppContainer>,
        rootEl
      )
    } catch (e) {
      render(
        <RedBox error={e}>
            <AppContainer>
                <NextApp store={store} history={hashHistory}/>
            </AppContainer>
        </RedBox>,
        rootEl
      )
    }
  });
}