import { defineStore } from 'pinia'
import { asyncRoutes,staticRouter } from '../../router'

export const useMenuStore = defineStore({
    id: 'menuState',
    state: ()=> ({
        // menu静态路由
        routers: [],
        // 动态路由
        addRouters: [],
        // 用户角色
        roles: []
    }),
    getters: {},
    actions: {
        // 设置角色
        generateRouter: function ({roles}: {roles:any}){
            let accessedRouters = filterAsyncRoutes({routes: asyncRoutes,roles: roles})
            this.addRouters = accessedRouters
            this.routers = staticRouter.concat(accessedRouters)
            return accessedRouters
        },
        // 动态生成访问路由
        setRoles({roles}:{roles: any}){

        }
    }
})

// 通过递归过滤asyncRoutes
export function filterAsyncRoutes({routes,roles}: {routes:any,roles: any}) {
    const res = []
    routes.forEach(route=> {
        const tmp = {...route}
        if(hasPermission(roles,tmp)){
            if(tmp.children){
                tmp.children = filterAsyncRoutes({routes:tmp.children,roles: roles})
            }
            res.push(tmp)
        }
    })
    return res
}

function hasPermission(roles,route){
    if(route.meta && route.meta.role){
        return roles.some(role=> route.meta.role.indexOf(role)>=0)
    }else {
        return true
    }
}
