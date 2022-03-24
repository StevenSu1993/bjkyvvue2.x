import Work from '../views/course/Work'
import Login from '../views/Login'
import ImageMaterial from '../views/materialCenter/ImageMaterial'
import TemplateMaterial from '../views/materialCenter/TemplateMaterial'
import Student from '../views/systemStudents/Student'
import ClassManage from '../views/systemStudents/ClassManage'
import AddMenu from '../views/menu/AddMenu'
import ShowMenu from '../views/menu/ShowMenu'
import Monitor from '../views/sysMonitor/Monitor'
import ShowStudentInfo from '../views/systemStudents/ShowStudentInfo'
import createWork from '../views/course/createWork'
// 尝试了好多写写法就是component 不能再对象中生成， 因为要引入文件所有只能写在这
const allRoutes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/work',
    name: '作业课程',
    component: Work
    // meta: {
    //     requireAuth: true
    // }
  },
  {
    path: '/imageM',
    name: '图文素材',
    component: ImageMaterial
  },
  {
    path: '/templateM',
    name: '模板素材',
    component: TemplateMaterial
  },
  {
    path: '/student',
    name: '学员总览',
    component: Student
    // component: () => import("../views/systemStudents/Student"),
  },
  {
    path: '/classManage',
    name: '班级管理',
    component: ClassManage
  },
  {
    path: '/addMenu',
    name: '添加菜单',
    component: AddMenu
  },
  {
    path: '/showMenu',
    name: '查看所有菜单',
    component: ShowMenu
  },
  {
    path: '/monitor',
    name: '查看系统信息',
    component: Monitor
  },
  {
    path: '/showStudentInfo',
    name: 'showStudentInfo',
    component: ShowStudentInfo
  },

  {
    path: '/createCourse',
    name: 'createCourse',
    component: createWork
  }
]
export default allRoutes
