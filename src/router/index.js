import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from "../components/Home"
import Welcome from "../components/Welcome"
import UserList from "../components/user/userList"
import PowList from "../components/power/PowList"
import RoleList from "../components/power/RoleList"
import SalaryList from "../components/salary/salaryList"
import SalaryDetail from "../components/salary/salaryDetail"
import MySalary from "../components/salary/mySalary"
import HolidayList from "../components/holiday/holidayList"
import ManageHoliday from "../components/holiday/manageHoliday"
// import { component } from 'vue/types/umd'
Vue.use(VueRouter)

const routes = [
    {path: '/', redirect: '/home'},
    {path: '/login', component: Login},
    {
        path: '/home',
        component: Home,
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/userList',
                component: UserList
            },
            {
                path: '/powList',
                component: PowList
            },
            {
                path: '/roleList',
                component: RoleList
            },
            {
                path: '/salaryList',
                component: SalaryList
            },
            {
                path: '/salaryDetail',
                component: SalaryDetail
            },
            {
                path: '/mySalary',
                component: MySalary
            },
            {
                path: '/holidayList',
                component: HolidayList
            },
            {
                path: '/manageHoliday',
                component: ManageHoliday
            }
        ]
    }
]

const router = new VueRouter({
    routes
})
// //挂载路由导航守卫
// router.beforeEach((to, from, next) => {
//     //to将要访问的路径
//     //from代表从哪个路径跳转过来
//     //next是一个函数表示放行
//     //next()放行  next('/login') 跳转到登登录页
//     if (to.path == '/login') return next();
//     //获取用户数据
//     const user = window.sessionStorage.getItem('user')
//     const cookie=document.cookie;
//     if (!cookie) return next('/login');
//     next()
//
// })
export default router
