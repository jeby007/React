import axios from 'axios'
import {message} from 'antd'

export default function ajax(url, data = {}, method = 'GET') {
  let promise;
  return new Promise((resolve, reject) => {
    if (method === 'GET') {
      promise = axios.get(url, {params: data})
    } else {
      promise = axios.post(url, data)
    }
    promise.then(response => {
      resolve(response.data)
    }).catch(error => {
      message.error('请求出错!')
    })
  })
}