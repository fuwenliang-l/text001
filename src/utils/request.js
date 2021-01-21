import { Toast } from 'vant';
import axios from 'axios'
import router from '@/router'
import qs from 'qs'
import isPlainObject from 'lodash/isPlainObject'
import doSM3 from './sm3-babel.js'
import aes from "./cryptoJS.js"; // 引入aes加密和解密
import baseURL  from  "./BaseUrl"

const http = axios.create({
  timeout: 1000 * 30,
  withCredentials: true ,
  // baseURL 
})

/**
 * 请求拦截
 */
http.interceptors.request.use(config => {
  // token
  config.headers['Authorization'] = window.localStorage.getItem('token')
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
  // console.log( config.headers);
  // config.headers['Content-Type'] = 'application/json'
  // 默认参数
  var defaults = {
    // '_t': new Date().getTime()
    // 'sign_cf' :"h5_iden:" + doSM3.getSignCf(),
  }
  if (config.method === 'get') {
    if (isPlainObject(config.params)) { 
      config.params = {
        ...defaults,
        ...config.params
      }
    }
  } else if (config.method === 'post' || 'put' || 'patch' || 'request' || 'delete') {
    console.log(config.data)
    console.log(config.url);
    if (isPlainObject(config.data)) {
      config.data = {
        ...defaults,
        ...config.data
      }
    }
    
    // if (config.url.includes('/order/getOrderConfirmData')) {
    //   config.data = aes.doAESfun(config.data);
    // }
    if (config.data) {

    } else {
      config.data = {}
    }
    config.data['sign_cf'] = "h5_iden:" + doSM3.getSignCf();
    var json = doSM3.setSign(config.data);
    config.data.sign_yq = doSM3.sm3(json);
    config.data = qs.stringify(config.data)
  }
  console.log(config.url);

  return config
}, error => {
  return Promise.reject(error)
})

/**
 * 响应拦截
 */
http.interceptors.response.use(response => {
  if (response.data && response.data.code === 401) { // 401, token失效
    Toast(response.data.msg);
    // http.get(`${process.env.API_HOST}/singlePointLanding/login`).then(({
    //   data
    // }) => {
    //   if (data && data.code == 'success') {
    //     window.location.href = data.ret
    //   }
    // })
  }
  return response
}, error => {
  return Promise.reject(error)
})

export default http
