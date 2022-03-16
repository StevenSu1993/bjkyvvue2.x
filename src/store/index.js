import Vue from 'vue';
import Vuex from 'vuex';
import {login} from '@/api/login';
import router from "../router";
import {removeToken, setToken} from '@/utils/auth';
import allRoutes from "../router/allRoute";
Vue.use(Vuex);

// 登录验证
export default new Vuex.Store({
  state: {
    newRoutes: [],
    logging: false,
    allMenu: [],
    jwt: ""
  },

  actions: {
    // 登录
    login1(context, user) {
      return login(user.username, user.password, user.code, user.uuid, user.rememberMe).then(res => {
        context.commit('saveJwt', res.data.data)
        setToken(res.data.data, user.rememberMe)
        localStorage.setItem("jwt", res.data.data);
        return true
      }).catch(err => {
        //返回值，在前面方法调用的时候是能接受到的，因为axois 返回的是promise 对象的，所以返回值包装在了 promise 中，调用方要用then 获取
        return false
      })
    },
    //利用promise 实现登录
    login(context, user) {
      return new Promise((resolve, reject) => {
        login(user.username, user.password, user.code, user.uuid, user.rememberMe).then(res => {
          context.commit('saveJwt', res.data.data)
          setToken(res.data.data, user.rememberMe)
          localStorage.setItem("jwt", res.data.data);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    //动态生成路由
    setRouteByMenu(context, allMenus) {
      // getNewRouters(allMenus)
      context.commit("setMenu", allMenus)
    }
  },
  mutations: {
    saveJwt(state, value) {
      state.jwt = value
    },
    logout(state, value) {
      //清除cookie 和 本地的缓存
      localStorage.removeItem("jwt")
      removeToken()
      state.logging = value
    },
    setMenu(state, allMenu) {
      state.newRoutes = getNewRouters(allMenu)
      state.allMenu = allMenu;
    }

  },
})

function getNewRouters(AllMenu) {
  //拿到系统配置好的所有的路由
  let newRoutes = router.options.routes
  AllMenu.forEach(m => {
    if (m.childMenu.length > 0) {
      m.childMenu.forEach(cm => {

        getNewRouters(allMenus)
        let r = allRoutes.find(elment => elment.name == cm.name)
        if (r != null) {
          newRoutes[2].children.push(r)
        }
      })
    }
  })
  router.addRoutes(newRoutes)
  return newRoutes
}

function createRoute(cm) {
  let str = cm.url.split("/")[1]
  let componentStr = cm.component
  let childM = {
    path: cm.url,
    name: str,
    component: () => import( '../views/systemStudents/' + cm.component),
    // component : () => require(cm.component),
  }
  return childM
}


/*
function createRoute(cm) {
    let str = cm.url.split("/")[1]
    let componentStr = cm.component
    let childM = {
        path: cm.url,
        name: str,
        component : () => import(cm.component),
        // component: eval("() => require(" + componentStr + ")"),
    }
    return childM
    // childM.component = () => import(cm.component)
    //     (resolve) => require([`@/views${route.componentName + menu.componentName}`], resolve)
    // childM.componet = eval("() => import(" + cm.component +  ")")

}*/
