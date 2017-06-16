/**
 * Created by Ben on 2016/12/26.
 */
require('es6-promise').polyfill();
import 'isomorphic-fetch'
import history from 'service/history'
import {Toast} from 'antd-mobile'
import confidential from '../config/Confidential'
import {getToken, Tool} from 'service'

export const fetchApi = {
  get(params, mchannal) {
    let token = localStorage.token;
    let account = localStorage.account;
    let password = localStorage.password;
    let headers = new Headers({});
    headers.append('mChannal', mchannal ? mchannal : confidential.M_CHANNAL);
    if (token) {
      headers.append('accessToken', token);
      headers.append('Mobile', account);
    }
    let requestParams = {
      method: "GET",
      headers,
    };
    if (params.length > 0) {
      return Promise.all(
        params.map(item => {
          let requesturl = item.url;
          let search = item.search;
          if (search) {
            requesturl += Tool.setSearchParams(search);
          }
          return fetch(requesturl, requestParams)
            .then(response => {
              return response.json();
            })
            .then(result => {
              if (result.code === 10000) {
                if (account && password) {
                  return getToken(account, password)
                    .then(secondToken => {
                      headers.set('accessToken', secondToken);
                      return fetch(requesturl, requestParams)
                        .then(response => response.json())
                        .then(result => {
                          if (result.code === 10000) {
                            Toast.info('登录超时，请重新登录');
                            history.push('/login')
                          } else {
                            return result
                          }
                        })
                    })
                    .catch(error => Toast.info(error.message))
                } else {
                  history.push('/login')
                }
              } else {
                return result
              }
            })
            .catch(error => Toast.info(error.message))
        })
      )
    } else {
      let requesturl = params.url;
      let search = params.search;
      if (search) {
        requesturl += Tool.setSearchParams(search);
      }
      return fetch(requesturl, requestParams)
        .then(response => {
          return response.json();
        })
        .then(result => {
          if (result.code === 10000) {
            if (account && password) {
              return getToken(account, password)
                .then(secondToken => {
                  headers.set('accessToken', secondToken);
                  return fetch(requesturl, requestParams)
                    .then(response => response.json())
                    .then(result => {
                      if (result.code === 10000) {
                        Toast.info('登录超时，请重新登录');
                        history.push('/login')
                      } else {
                        return result
                      }
                    })
                })
                .catch(error => Toast.info(error.message))
            } else {
              history.push('/login')
            }
          } else {
            return result
          }
        })
        .catch(error => Toast.info(error.message))
    }
  },
  post(params, mchannal) {
    let token = localStorage.token;
    let account = localStorage.account;
    let password = localStorage.password;
    let headers = new Headers();
    headers.append('mChannal', mchannal ? mchannal : confidential.M_CHANNAL);
    if (token) {
      headers.append('accessToken', token);
      headers.append('Mobile', account);
    }
    let requestParams = {
      method: "POST",
      headers,
    };
    let requesturl = params.url;
    let search = params.search;
    if (search) {
      requestParams.body = new FormData()
      if (search.length) {
        search.map(s => {
          for (let key in s) {
            if (s[key] !== null) requestParams.body.append(key, s[key])
          }
        })
      } else {
        for (let key in search) {
          if (search[key] !== null) requestParams.body.append(key, search[key]);
        }
      }
    }
    return fetch(requesturl, requestParams)
      .then(response => response.json())
      .then(result => {
        if (result.code === 10000) {
          if (account && password) {
            return getToken(account, password)
              .then(secondToken => {
                headers.set('accessToken', secondToken);
                return fetch(requesturl, requestParams)
                  .then(response => response.json())
                  .then(result => {
                    if (result.code === 10000) {
                      Toast.info('登录超时，请重新登录');
                      history.push('/login')
                    } else {
                      return result
                    }
                  })
              })
              .catch(error => Toast.info(error.message))
          } else {
            history.push('/login')
          }
        } else {
          return result
        }
      }).catch(error => Toast.info(error.message))
  },
  postJson(params, mchannal) {
    let token = localStorage.token;
    let account = localStorage.account;
    let password = localStorage.password;
    let headers = new Headers();
    headers.append('mChannal', mchannal ? mchannal : confidential.M_CHANNAL);
    headers.append('Accept', 'application/json, text/plain, */*');
    headers.append('Content-Type', 'application/json');
    if (token) {
      headers.append('accessToken', token);
      headers.append('Mobile', account)
    }
    let requestParams = {
      method: "POST",
      body: '',
      headers,
    };

    let requesturl = params.url;
    let search = params.search;
    if (search) {
      requestParams.body = JSON.stringify(search)
    }
    return fetch(requesturl, requestParams)
      .then(response => response.json())
      .then(result => {
        if (result.code === 10000) {
          if (account && password) {
            return getToken(account, password)
              .then(secondToken => {
                headers.set('accessToken', secondToken);
                return fetch(requesturl, requestParams)
                  .then(response => response.json())
                  .then(result => {
                    if (result.code === 10000) {
                      Toast.info('登录超时，请重新登录');
                      history.push('/login')
                    } else {
                      return result
                    }
                  })
              })
              .catch(error => Toast.info(error.message))
          } else {
            history.push('/login')
          }
        } else {
          return result
        }
      }).catch(error => Toast.info(error.message))
  }
}