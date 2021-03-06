import Vue from 'vue'
import Router from 'vue-router'
import Login from '../views/Login'
import { getToken } from '@/utils/auth'
import Index from '../views/Index'
import store from '../store/index'
import ShowStudentInfo from '../views/systemStudents/ShowStudentInfo'
import request from '@/utils/request'
import allRoutes from '@/router/allRoute'
import EditTemplateMaterial from '@/views/materialCenter/EditTemplateMaterial'
import CreateHomeWork from '@/views/course/CreateHomeWork'
import EditCourse from '@/views/course/EditCourse'
import CreateCourse from '@/views/course/CreateCourse'
import CommentComponent from '@/views/course/CommentComponent'
import CommentForm from '@/views/course/component/CommentForm'

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },

  {
    path: '/index',
    name: 'index',
    component: Index,
    children: [
      {
        path: '/showStudentInfo',
        name: 'showStudentInfo',
        component: ShowStudentInfo
      },
      {
        path: '/createCourse',
        name: 'createCourse',
        component: CreateCourse
      },
      {
        path: '/course/:id',
        name: 'editCourse',
        meta: {
          activeMenu: '/course'
        },
        component: EditCourse
      }
    ]
  },
  {
    path: '/editorTemplate',
    name: 'editorTemplate',
    component: EditTemplateMaterial
  },
  {
    path: '/createHomeWork',
    name: 'createHomeWork',
    component: CreateHomeWork
  },
  // 后续要删除掉的
  {
    path: '/CommentComponent',
    name: 'CommentComponent',
    component: CommentComponent
  },

  {
    path: '/testCommentForm',
    name: 'testCommentForm',
    component: CommentForm
  }
]

const router = new Router({
  model: 'history',
  routes
})

// 根据菜单动态生成路由
function getRoutes (allmenu) {
  // 拿到系统配置好的所有的路由
  const newRoutes = router.options.routes
  allmenu.forEach(m => {
    if (m.childMenu.length > 0) {
      m.childMenu.forEach(cm => {
        // eslint-disable-next-line eqeqeq
        const r = allRoutes.find(elment => elment.name === cm.name)
        if (r != null) {
          newRoutes[2].children.push(r)
        }
      })
    }
  })

  router.addRoutes(newRoutes)
  return newRoutes
}

// 假如用户A没有登录，访问了Login页面
router.beforeEach(async (to, from, next) => {
  if (getToken() !== 'undefined' && getToken()) { // 已登录
    // 登录成功以后去查看缓存中是否有menu数据， 没有就去跟服务器要
    if (!store.state.allMenu.length > 0) {
      await request.get('api/auth/getMenu').then(res => {
        // console.log(res.data.data)
        const allmenu = res.data.data
        // 把菜单放到store中去，为了动态生成路由
        store.dispatch('setRouteByMenu', allmenu)
        getRoutes(allmenu)
        next({
          ...to,
          replace: true
        })// router.addRoutes 是异步的。 这一步相当于做了一次拦截，让浏览器在重新访问一次。下次进来的时候就能访问到我们添加的路由策略了。同时也能解决访问地址空白的页面的情况
      })
    }
    // console.log("去访问后端以后生成的路由", router.options.routes)
    // eslint-disable-next-line eqeqeq
    if (to.path === '/login') {
      next('/index')
    } else {
      next()
    }
  } else if (to.path !== '/login') {
    // 没有登录
    next({ path: '/login' }) // 如果不是登陆页面，重定向到登陆页面
  } else {
    next()
  } // 如果是登陆页面，就直接放行
})

export default router
