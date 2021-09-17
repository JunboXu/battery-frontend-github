import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

axios.defaults.withCredentials = true

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url

  //API
  baseURL: '/api',
  // baseURL: 'http://121.196.124.158:8099',
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 100000 // request timeout
})

// response interceptor
service.interceptors.response.use(
  /**1、头、request、返回值变化的策略、、todo
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if (res.code !== undefined && res.code !== 200 &&res.code !==20000) {
    // if (res.code==50001) {
    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })
    // }

    return res

    //   if (res.code !== undefined && res.code !== 200 &&res.code !==20000) {

    //   Message({
    //     message: res.message || 'Error',
    //     type: 'error',
    //     duration: 5 * 1000
    //   })

    //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
    //   if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
    //     // to re-login
    //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
    //       confirmButtonText: 'Re-Login',
    //       cancelButtonText: 'Cancel',
    //       type: 'warning'
    //     }).then(() => {
    //       store.dispatch('user/resetToken').then(() => {
    //         location.reload()
    //       })
    //     })
    //   }
    //   return Promise.reject(new Error(res.message || 'Error'))
    // } else {
    //   return res
    // }
  },
  error => {
    // console.log("error的response", response.data);
    // console.log('err' + error) // for debug
    // Message({
    //   message: error.response.data,
    //   type: 'error',
    //   duration: 20 * 1000
    // })

    return Promise.reject(error)
  }
)
// request interceptor

service.interceptors.request.use(function (config) {
    // let token = window.localStorage.getItem("accessToken")
    // if (token) {
    //     config.headers.accessToken = token;
    //     return config;
    //     //这里经常搭配token使用，将token值配置到tokenkey中，将tokenkey放在请求头中
    //     // config.headers['accessToken'] = Token;
    // }
    return config;
})

export default service
