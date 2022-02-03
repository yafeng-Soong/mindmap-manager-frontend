import axios from 'axios'
import router from '../router/index'
import Vue from 'vue'
import store from "../store";



axios.defaults.baseURL = '/api'
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true //允许跨域携带cookie

axios.interceptors.response.use(
    res =>{
        if (res.data.code === 401)
            router.replace("/login")
        // console.log(res.headers["newtoken"])
        if (res.headers["newtoken"]) {
            // 若有newtoken则刷新token
            store.commit("setToken", res.headers["newtoken"])
            console.log('token refresh~~~')
        }
        return res
    },
    err =>{
        // 网络错误统一在此处理
        if (err.response && err.response.status === 401) {
          Vue.prototype.$toast.error("您没有相应的权限")
        //   router.go(-1)
        }else {
          Vue.prototype.$toast.error("~~网络出小差了~~")
        }
        return Promise.reject(err)
    })

axios.interceptors.request.use(
    config => {
        let token = store.getters.getToken
        if (token)
            config.headers.Authorization = token
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

export function methodGet(url,params) {
    return new Promise((resolve,reject) => {
        axios.get(url,{params})
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export function methodPost(url,params,headers={}) {
    return new Promise((resolve,reject) => {
        axios.post(url,params,{headers})
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}

export function methodPut(url, params, headers={}) {
  return new Promise((resolve, reject) => {
    axios.put(url, params, {headers})
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error)
      })
  })
}

export function methodDelete(url, params) {
    return new Promise((resolve, reject) => {
        axios.delete(url, {params})
            .then(response => {
                resolve(response.data)
            })
            .catch(error => {
                reject(error)
            })
    })
}


export default {
    methodGet,
    methodPost,
    methodDelete,
}
