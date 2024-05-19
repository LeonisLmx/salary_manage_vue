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
export default router
