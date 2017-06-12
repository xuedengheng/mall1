/**
 * Created by Ben on 2017/2/27.
 */
require('es6-promise').polyfill();
import 'isomorphic-fetch'
import {Toast} from 'antd-mobile'
import {urlApi} from 'service'
import confidential from '../config/Confidential'

export const getToken = (account, password) => {
    let url = urlApi.auth.getToken;
    let params = {
        account,
        password,
        ipAddr: ip
    }
    let requests = {
        method: "POST",
        body: new FormData(),
        headers: {
            mChannal: confidential.M_CHANNAL
        }
    };
    for (let key in params) {
        requests.body.append(key, params[key])
    }
    return fetch(url, requests)
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                Toast.info('网络异常，请检查网络');
            }
        })
        .then(result => {
            localStorage.setItem('token', result.token);
            localStorage.setItem('userInfo', JSON.stringify(result.userInfo));
            return result.token
        })
        .catch(error => Toast.info('网络异常，请检查网络'))
}
