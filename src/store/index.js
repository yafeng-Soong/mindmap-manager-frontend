import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentUser: null,
    baseUrl:'/api',
    themeInfo: null,
    paperInfo: null,
    tagInfo: null
  },
  mutations: {
    SET_CURRENT_USER: (state, payload) => {
      //刷新后state中的数据就没有了，所以对于当前用户数据来说可以考虑存到session中
      sessionStorage.setItem("currentUser",JSON.stringify(payload))
      state.currentUser = payload
    },
    setThemeInfo: (state, payload) => {
      sessionStorage.setItem("themeInfo",JSON.stringify(payload))
      state.themeInfo = payload
    },
    deleteThemeInfo: (state) => {
      sessionStorage.removeItem("themeInfo")
      state.themeInfo = null
    },
    setPaperInfo: (state, payload) => {
      sessionStorage.setItem('paperInfo', JSON.stringify(payload))
      state.paperInfo = payload
    },
    deletePaperInfo: (state) => {
      sessionStorage.removeItem("paperInfo")
      state.paperInfo = null
    },
    setTagInfo: (state, payload) => {
      sessionStorage.setItem('tagInfo', JSON.stringify(payload))
      state.tagInfo = payload
    },
    deleteTagInfo: (state) => {
      sessionStorage.removeItem('tagInfo')
      state.tagInfo = null
    }
  },
  getters: {
    getCurrentUser: (state) => {
      if (!state.currentUser)
        state.currentUser = JSON.parse(sessionStorage.getItem("currentUser"))
      return state.currentUser
    },
    getBaseUrl: state => state.baseUrl,
    getThemeInfo: (state) => {
      if (!state.themeInfo)
        state.themeInfo = JSON.parse(sessionStorage.getItem("themeInfo"))
      return state.themeInfo
    },
    getPaperInfo: (state) => {
      if (!state.paperInfo)
        state.paperInfo = JSON.parse(sessionStorage.getItem("paperInfo"))
      return state.paperInfo
    },
    getTagInfo: (state) => {
      if (!state.tagInfo)
        state.tagInfo = JSON.parse(sessionStorage.getItem('tagInfo'))
      return state.tagInfo
    }
  },
  actions: {
  },
  modules: {
  }
})
