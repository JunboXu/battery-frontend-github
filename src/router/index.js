import Vue from 'vue'
import Router from 'vue-router'

// Containers
const TheContainer = () => import('@/containers/TheContainer')
const TheContainer2 = () => import('@/containers/TheContainer2')
const TheContainer3 = () => import('@/containers/TheContainer3')

// Views
const Dashboard = () => import('@/views/Dashboard')

const Colors = () => import('@/views/theme/Colors')
const Typography = () => import('@/views/theme/Typography')

const Softwares = () => import('@/views/outSide/Software')
const TestPlans = () => import('@/views/outSide/TestPlan')
const TestTasks = () => import('@/views/outSide/TestTask')
const TestNoPass = () => import('@/views/outSide/TestNoPass')
const softwareDetail = () => import('@/views/software/Detail')
const softwareTestPlan = () => import('@/views/software/TestPlan')
const softwareTestTask = () => import('@/views/software/TestTask')
const softwareTestNoPass = () => import('@/views/software/TestNoPass')
const TestPlanDetail = () => import('@/views/software/TestPlanDetail')
const TestTaskDetail = () => import('@/views/software/TestTaskDetail')
const accountSetting = () => import('@/views/user/accountSetting')


const Charts = () => import('@/views/charts/Charts')
const Widgets = () => import('@/views/widgets/Widgets')

// Views - Components
const Cards = () => import('@/views/base/Cards')
const Forms = () => import('@/views/base/Forms')
const Switches = () => import('@/views/base/Switches')
const Tables = () => import('@/views/base/Tables')
const Tabs = () => import('@/views/base/Tabs')
const Breadcrumbs = () => import('@/views/base/Breadcrumbs')
const Carousels = () => import('@/views/base/Carousels')
const Collapses = () => import('@/views/base/Collapses')
const Jumbotrons = () => import('@/views/base/Jumbotrons')
const ListGroups = () => import('@/views/base/ListGroups')
const Navs = () => import('@/views/base/Navs')
const Navbars = () => import('@/views/base/Navbars')
const Paginations = () => import('@/views/base/Paginations')
const Popovers = () => import('@/views/base/Popovers')
const ProgressBars = () => import('@/views/base/ProgressBars')
const Tooltips = () => import('@/views/base/Tooltips')




// Views - Buttons
const StandardButtons = () => import('@/views/buttons/StandardButtons')
const ButtonGroups = () => import('@/views/buttons/ButtonGroups')
const Dropdowns = () => import('@/views/buttons/Dropdowns')
const BrandButtons = () => import('@/views/buttons/BrandButtons')

// Views - Icons
const CoreUIIcons = () => import('@/views/icons/CoreUIIcons')
const Brands = () => import('@/views/icons/Brands')
const Flags = () => import('@/views/icons/Flags')

// Views - Notifications
const Alerts = () => import('@/views/notifications/Alerts')
const Badges = () => import('@/views/notifications/Badges')
const Modals = () => import('@/views/notifications/Modals')

// Views - Pages
const Page404 = () => import('@/views/pages/Page404')
const Page500 = () => import('@/views/pages/Page500')
const Login = () => import('@/views/pages/Login')
const LoginPage = () => import('@/views/pages/LoginPage')

const Register = () => import('@/views/pages/Register')

// Users
const Users = () => import('@/views/users/Users')
const User = () => import('@/views/users/User')

Vue.use(Router)

//todo
export default new Router({
  mode: 'hash', // https://router.vuejs.org/api/#mode
  linkActiveClass: 'active',
  scrollBehavior: () => ({ y: 0 }),
  routes: configRoutes()
})

function configRoutes () {
  return [
    {
      path: '/pages',
      redirect: '/pages/404',
      name: 'Pages',
      component: {
        render (c) { return c('router-view') }
      },
      children: [
        {
          path: '404',
          name: 'Page404',
          component: Page404
        },
        {
          path: '500',
          name: 'Page500',
          component: Page500
        },
        {
          path: 'login',
          name: 'Login',
          component: Login
        },
        {
          path: 'register',
          name: 'Register',
          component: Register
        }
      ]
    },
    {
      path: '/',
      redirect: '/pages/login',
      name: '首页',
      component: TheContainer,
      children: [
        {
          path: 'dashboard',
          name: '仪表盘',
          component: Dashboard
        },
        {
          path: 'softwares',
          name: '测试项目',
          component: Softwares,
        },
        {
          path: 'testPlans',
          name: '测试计划',
          component: TestPlans,
        },
        {
          path: 'testTasks',
          name: '测试任务',
          component: TestTasks,
        },
        {
          path: 'testNoPass',
          name: '不合格项',
          component: TestNoPass,
        },
      ]
    },

    {
      path: '/softwareInside/:id',
      redirect: '/softwareDetail/:id',
      name: '测试项目',
      component: TheContainer2,
      children: [
        {
          path: '/softwareDetail/:id',
          name: '项目概况',
          component: softwareDetail
        },
        {
          path: '/softwareTestPlan/:id',
          name: '测试计划',
          component: softwareTestPlan
        },
        {
          path: '/softwareTestPlanDetail/:id',
          name: '测试计划详情',
          component: TestPlanDetail,
        },
        {
          path: '/softwareTestTask/:id',
          name: '测试任务',
          component: softwareTestTask,
        },
        {
          path: '/softwareTestTaskDetail/:id',
          name: '测试任务详情',
          component: TestTaskDetail,
        },
        {
          path: '/softwareTestNoPass/:id',
          // redirect: '/theme-inside/colors',
          name: '不合格项',
          component: softwareTestNoPass,
        },
        
      ]
    },
    {
      path: '/accountSetting',
      name: '个人中心',
      component: TheContainer3,
      children: [
        {
          path: '',
          name: '账号设置',
          component: accountSetting
        },
      ]
    }
  ]
}

