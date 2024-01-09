// 1、导入Vue Router模块
import { createRouter,createWebHashHistory,createWebHistory } from 'vue-router'
import Nprogress from "../config/nprogress";
import {useUserStore} from "../store/modules/user";
import {useMenuStore} from "../store/modules/menu";
import {useStudentStore} from "../store/modules/student";
// 定义一些路由，每一个都需要映射到一个组件

// 定义静态路由
export const staticRouter = [
    {
        path: '/',
        meta: { title: '学灯网-个人开发者创业专用一站式在线教育平台' },
        isMenu: false,
        component: ()=> import('@/views/edu/index/Index.vue')
    },
    {
        path: '/index',
        name: 'Index',
        meta: { title: '学灯网-个人开发者创业专用一站式在线教育平台' },
        isMenu: false,
        component: ()=> import('@/views/edu/index/Index.vue')
    },
    {
        path: '/edu',
        name: 'Edu',
        redirect: '/edu/list',
        isMenu: false,
        children: [
            {
                path: 'list',
                name: 'List',
                meta: {title: '全部课程 - 学灯网'},
                component: ()=>import('@/views/edu/list/List.vue')
            },
            {
                path: 'details/:id',
                name: 'Details',
                component: ()=>import('@/views/edu/details/Details.vue')
            },
            {
                path: 'vip',
                name: 'VipInfo',
                meta: {title: 'vip详情 - 学灯网'},
                component: ()=>import('@/views/edu/vip/VipInfo.vue')
            },
            {
                path: 'design',
                name: 'Design',
                meta: {title: '毕业设计 - 学灯网'},
                component: ()=>import('@/views/edu/design/GraduationDesign.vue')
            },
            {
                path: 'viporderpay/:orderno',
                name: 'VipOrderPay',
                meta: {title: 'VIP订单付款 - 学灯网'},
                component: ()=>import('@/views/edu/vip/VipOrderPay.vue')
            },
            {
                path: 'studyCourse/:orderno',
                name: 'StudyCourse',
                meta: {title: '课程订单付款 - 学灯网'},
                component: ()=>import('@/views/edu/details/components/CourseOrderPay.vue')
            },
            {
                path: 'play',
                name: 'PlayVideo',
                component: ()=> import('@/views/edu/video/PlayVideo.vue')
            },
            {
                path: 'login',
                name: 'EduLogin',
                meta: {title: '登录学灯网'},
                component: ()=>import('@/views/edu/login/Login.vue')
            },
            {
                path: 'student/myinfo',
                name: 'MyInfo',
                meta: {title: '个人信息-学灯网'},
                component: ()=> import('@/views/edu/student/MyInfo.vue')
            },
            {
                path: 'student/mycourse',
                name: 'MyCourse',
                meta: {title: '我的课程-学灯网'},
                component: ()=> import('@/views/edu/student/MyCourse.vue')
            },
            {
                path: 'student/myvip',
                name: 'MyVip',
                meta: {title: '购买VIP记录-学灯网'},
                component: ()=> import('@/views/edu/student/MyVip.vue')
            },
            {
                path: 'student/mydownload',
                name: 'MyDownload',
                meta: {title: '下载课程资料记录-学灯网'},
                component: ()=> import('@/views/edu/student/MyDownload.vue')
            },
            {
                path: 'student/account',
                name: 'Account',
                meta: {title: '绑定账号-学灯网'},
                component: ()=> import('@/views/edu/student/Account.vue')
            },
            {
                path: 'student/mycoupon',
                name: 'MyCoupon',
                meta: {title: '我的优惠券-学灯网'},
                component: ()=> import('@/views/edu/student/MyCoupon.vue')
            },
        ]
    },
    {
        path: '/login',
        name: 'Login',
        meta: { title: '后台管理系统-后台登录' },
        component: ()=> import('@/views/system/login/Login.vue'),
        isMenu: false
    },
    {
        path: '/homeindex',
        name: 'homeindex',
        component: ()=> import('@/views/system/layout/Index.vue'),
        redirect: '/home',
        isMenu: true,
        funcNode: 1,
        children: [
            {
                path: '/home',
                name: 'home',
                meta: { title: '首页',icon: 'House',affix: true},
                component: ()=> import('@/views/system/home/Index.vue')
            }
        ]

    },
    {
        path: '/user',
        name: 'userSetting',
        redirect: '/user/setting',
        component: ()=>import('@/views/system/layout/Index.vue'),
        isMenu: true,
        funcNode: 1,
        children: [
            {
                path: 'setting',
                name: 'PersonalSettings',
                meta: { title: '个人设置',icon: 'Basketball' },
                component: ()=> import('@/views/system/user/components/PersonalSettings.vue')
            }
        ]
    }

]

// 定义动态路由
export const asyncRoutes = [
    {
        path: '/siteset',
        name: 'SiteSet',
        meta: {
            title: '网站设置',
            icon: 'Setting',
            role: ['ROLE_ADMIN']
        },
        redirect: '/siteset/pay',
        component: ()=> import('@/views/system/layout/Index.vue'),
        isMenu: true,
        funcNode: 2,
        children: [
            {
                path: 'pay',
                name: 'Pay',
                meta: {
                    title: '支付设置',
                    icon: 'Money',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/pay/PayList.vue')
            },
            {
                path: 'wxcode',
                name: 'WxCode',
                meta: {
                    title: '微信登录设置',
                    icon: 'Cellphone',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/wxcode/WxCodeList.vue')
            },

            {
                path: 'sms',
                name: 'Sms',
                meta: {
                    title: '短信设置',
                    icon: 'Iphone',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/sms/SmsSet.vue')
            },

            {
                path: 'email',
                name: 'Email',
                meta: {
                    title: '邮箱设置',
                    icon: 'BellFilled',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/email/EmailSet.vue')
            },

            {
                path: 'file',
                name: 'File',
                meta: {
                    title: '文件存储设置',
                    icon: 'SetUp',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/file/FileSet.vue')
            },

        ]
    },
    {
        path: '/finance',
        name: 'Finance',
        meta: {
            title: '财务中心',
            icon: 'Coin',
            role: ['ROLE_ADMIN']
        },
        redirect: '/finance/order',
        component: ()=> import('@/views/system/layout/Index.vue'),
        isMenu: true,
        funcNode: 2,
        children: [
            {
                path: 'order',
                name: 'order',
                meta: {
                    title: '订单明细',
                    icon: 'ShoppingCart',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/order/OrderList.vue')
            },
            {
                path: 'dealmoney',
                name: 'DealMoney',
                meta: {
                    title: '收入明细',
                    icon: 'Cellphone',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/dealmoney/DealMoneyList.vue')
            },

            {
                path: 'refund',
                name: 'Refund',
                meta: {
                    title: '退款记录',
                    icon: 'CreditCard',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/refund/RefundList.vue')
            },

        ]
    },

    {
        path: '/marketing',
        name: 'Marketing',
        meta: {
            title: '营销中心',
            icon: 'Bowl',
            role: ['ROLE_ADMIN']
        },
        redirect: '/marketing/coupons',
        component: ()=> import('@/views/system/layout/Index.vue'),
        isMenu: true,
        funcNode: 2,
        children: [
            {
                path: 'coupons',
                name: 'Coupons',
                meta: {
                    title: '代金券管理',
                    icon: 'Handbag',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/marketing/CashCouponsStockList.vue')
            },
        ]
    },

    {
        path: '/daily',
        name: 'Daily',
        meta: {
            title: '课程中心',
            icon: 'GoldMedal',
            role: ['ROLE_ADMIN']
        },
        redirect: '/daily/subject',
        component: ()=> import('@/views/system/layout/Index.vue'),
        isMenu: true,
        funcNode: 2,
        children: [
            {
                path: 'subject',
                name: 'Subject',
                meta: {
                    title: '分类管理',
                    icon: 'Clock',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/subject/SubjectList.vue')
            },
            {
                path: 'course',
                name: 'Course',
                meta: {
                    title: '课程管理',
                    icon: 'Box',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/course/CourseList.vue')
            },

            {
                path: 'banner',
                name: 'Banner',
                meta: {
                    title: '轮播图管理',
                    icon: 'Clock',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/banner/BannerList.vue')
            },

        ]
    },
    {
        path: '/base',
        name: 'Base',
        meta: {
            title: '数据中心',
            icon: 'DataAnalysis',
            role: ['ROLE_ADMIN']
        },
        redirect: '/base/student',
        component: ()=> import('@/views/system/layout/Index.vue'),
        isMenu: true,
        funcNode: 2,
        children: [
            {
                path: 'student',
                name: 'Student',
                meta: {
                    title: '学生管理',
                    icon: 'Avatar',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/student/StudentList.vue')
            },
            {
                path: 'studentid',
                name: 'Studentid',
                meta: {
                    title: '学号管理',
                    icon: 'List',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/student/StudentIdList.vue')
            },
            {
                path: 'viptype',
                name: 'VipType',
                meta: {
                    title: 'VIP管理',
                    icon: 'School',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/viptype/VipTypeList.vue')
            },
            {
                path: 'teacher',
                name: 'Teacher',
                meta: {
                    title: '讲师管理',
                    icon: 'Avatar',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/edu/teacher/TeacherList.vue')
            },
        ]

    },
    {
        path: '/system',
        name: 'system',
        meta: {
            title: '系统管理',
            icon: 'GoldMedal',
            role: ['ROLE_ADMIN']
        },
        redirect: '/system/user',
        component: ()=> import('@/views/system/layout/Index.vue'),
        isMenu: true,
        funcNode: 2,
        children: [
            {
                path: 'user',
                name: 'user',
                meta: {
                    title: '用户管理',
                    icon: 'UserFilled',
                    role: ['ROLE_ADMIN']
                },
                component: ()=> import('@/views/system/user/UserList.vue')
            },
            {
                path: 'role',
                name: 'Role',
                meta: {
                    title: '角色管理',
                    icon: 'Stamp',
                    role: ['ROLE_ADMIN']
                },
                component: () => import('@/views/system/role/RoleList.vue')
            },
            {
                path: 'log',
                name: 'Log',
                meta: {
                    title: '日志管理',
                    icon: 'Histogram',
                    role: ['ROLE_ADMIN']
                },
                component: () => import('@/views/system/log/LogList.vue')
            }
        ]
    }
]


// 3、创建路由实例并传递‘routes’配置
const router = createRouter({
    history: createWebHistory(),
    routes: staticRouter
})

// 设置白名单
const whiteList = ['/index','/login','/edu/details','/edu/list','/edu/vip','/edu/design']
// 路由拦截守卫
router.beforeEach(async (to,from,next)=> {
    // 1.Nprogress 开始
    Nprogress.start()
    // 2.设置标题
    if(typeof(to.meta.title) === 'string'){
        document.title = to.meta.title ||'学灯网-个人开发者创业专用一站式在线教育平台'
    }

    // 3.如果是白名单的路径，直接放行
    const some = whiteList.some(function (item) {
        return to.path.indexOf(item)!==-1
    })
    //4. 白名单直接放行
    if (some) {
        next()
    }else{
        // 5.判断访问路径是前台还是后台
        if(to.path.indexOf('edu')!==-1){
            // 6.判断前台是否有token，没有重定向login
            const studentStore = useStudentStore()
            // 已经登录,直接放行
            if(studentStore.studentToken!=''){
                next()
            // 未登录，跳转到前台登录页
            }else{
                return next({path: `/edu/login?redirect=${to.path}`,replace:true})
            }
        }else {
            // 7.判断是否有token，没有重定向login
            const userStore = useUserStore()
            if(userStore.token!=''){
                // 获取登录用户的角色
                const { userInfo } =userStore
                const roles = []
                roles.push(userInfo.role.code)

                // 根据角色动态生成路由访问映射
                const menuStore = useMenuStore()

                if(!menuStore.routers.length){
                    const accessRoutes = menuStore.generateRouter({roles: roles})
                    accessRoutes.forEach(item => router.addRoute(item))
                    next({...to,replace:true})
                }else {
                    // 正常访问页面
                    next()
                }

            }else {
                return next({path: `/index?redirect=${to.path}`,replace:true})
            }

        }

    }

})

// 路由跳转结束
router.afterEach(()=> {
    Nprogress.done()
})

// 路由跳转失败
router.onError(error=> {
    Nprogress.done()
    console.warn("路由错误",error.message)
})

export default router
