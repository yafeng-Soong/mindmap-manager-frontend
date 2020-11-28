import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    redirect: '/myMindmap',
    children: [
      {
        path: '/myMindmap',
        name: 'MyMindmap',
        component: () => import('../views/mindmap/MyMindmap.vue')
      },
      {
        path: '/mindmapInfo',
        name: 'MindmapInfo',
        component: () => import('../views/mindmap/MindmapInfo.vue')
      },
      {
        path: '/helloWorld',
        name: 'HelloWorld',
        component: () => import('../components/HelloWorld.vue')
      },
      {
        path: '/submit',
        name: 'Submit',
        component: () => import('../views/paper/Submit.vue')
      },
      {
        path: '/paperInfo',
        name: 'PaperInfo',
        component: () => import('../views/paper/PaperInfo.vue')
      },
      {
        path: '/myPaper',
        name: 'MyPaper',
        component: () => import('../views/paper/MyPaper.vue')
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
]

const router = new VueRouter({
  routes
})

export default router
