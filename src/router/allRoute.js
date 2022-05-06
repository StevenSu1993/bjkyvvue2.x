import Login from '../views/Login'
import ImageMaterial from '../views/materialCenter/ImageMaterial'
import NewTemplateMaterial from '../views/materialCenter/NewTemplateMaterial'
import Student from '../views/systemStudents/Student'
import ClassManage from '../views/systemStudents/ClassManage'
import AddMenu from '../views/menu/AddMenu'
import ShowMenu from '../views/menu/ShowMenu'
import Monitor from '../views/sysMonitor/Monitor'
import ShowStudentInfo from '../views/systemStudents/ShowStudentInfo'
import TemplateMaterial from '@/views/materialCenter/TemplateMaterial'
import CreateHomeWork from '@/views/course/CreateHomeWork'
import Course from '@/views/course/Course'
import EditCourse from '@/views/course/EditCourse'
import CreateCourse from '@/views/course/CreateCourse'
// 尝试了好多写写法就是component 不能再对象中生成， 因为要引入文件所有只能写在这
const allRoutes = [
  {
    path: '/',
    name: 'login',
    component: Login
  },
  {
    path: '/course',
    name: '作业课程',
    component: Course
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
    path: '/newTemplateM',
    name: '新建模板素材',
    component: NewTemplateMaterial
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
    component: CreateCourse
  },

  {
    path: '/TemplateM',
    name: '模板素材',
    component: TemplateMaterial
  },
  {
    path: '/course/:id',
    name: 'editCourse',
    meta: {
      activeMenu: '/course'
    },
    component: EditCourse
  },
  {
    path: '/createHomeWork',
    name: 'createHomeWork',
    component: CreateHomeWork
  }
]
export default allRoutes
