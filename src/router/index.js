import router from './router'
import Http from '@/api/http/http'
import store from '@/store/store'
import Storage from '@/api/storage/storage'
// 引入进度条插件
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
// 后台管理页面模板
import Layout from '@/views/home.vue'
// 默认路由页，用来存放子路由的纯路由页面
import DefaultPage from '@/Layout/index.vue'
import Welcome from '@/views/welcome.vue'

// 默认后台管理模板
const layout = {
    path: '/home',
    name: 'home',
    component: Layout,
    children: [{
        path: "welcome",
        name: "首页",
        meta: {
            title: "首页"
        },
        component: Welcome
    }]
}

// 动态生成路由
function generateRouter(list, pre, now) {
    // 如果含有重定向（含有子菜单），则继续遍历添加
    if(now && now.redirect) {
        let options = {
            path: now.path || "/",
            name: now.meta.title,
            component: DefaultPage,
            meta: now.meta,
            redirect: now.redirect,
            children: []
        }
        list.forEach(value => {
            value.meta.iframe = value.iframe
            // 如果子菜单存在，重新遍历
            if(value.children) {
                generateRouter(value.children, options, value)
            }
            // 如果当前的路由为父级路由，将子路由添加到父路由下
            if(!value.redirect) { 
                options.children.push({
                    path: value.path,
                    name: value.name,
                    meta: value.meta,
                    component: () => {
                        if(value.component === "Layout") {
                            router.push({ path: "/404" })
                        }else {
                            return import(`@/views${value.component}`)
                        }
                    }
                })
            }
        })
        pre.children.push(options)
    }else { 
        list.forEach(value => {
            // 如果子菜单存在，继续递归
            if(value.children) {
                generateRouter(value.children, pre, value)
            }
            // 将没有重定向的菜单先将入到layout路由里作为子路由，避免路由重复
            if(!value.redirect) {
                pre.children.push({
                    path: value.path,
                    name: value.name,
                    meta: value.meta,
                    component: () => {
                        if(value.component === "Layout") {
                            router.push({ path: "/404" })
                        }else {
                            return import(`@/views${value.component}`)
                        }
                    }
                })
            }
        })
    }
}

function getRouter() {
    if(store.state.menuList.length == 0) {
        Http.http_json({
            url: "/api/menu/build",
            method: "get"
        }).then(result => {
            const list = result.data
            store.commit("setMenuList", list)
            generateRouter(list, layout)
            router.addRoutes([ layout ])
            router.addRoutes([{
                path: "*",
                redirect: "/404"
            }])
        })
    }
}

// 动态生成路由并做拦截
router.beforeEach((to, from, next) => {
    to.meta.title
    && (document.title = to.meta.title)
    NProgress.start()
    if(to.name === "login") {
        next()
        return
    }
    if(Storage.getMemoryPmt('token')) {
        if(to.path === "/") {
            next({ path: '/login' })
        }else {
            // 如果用户信息存在，拉取动态路由与菜单
            if(store.state.user.phone) {
                getRouter()
            }
            // 如果菜单信息不存在（直接访问），重新拉取动态路由与菜单
            if(store.state.menuList.length == 0) {
                getRouter()
            }
            next()
        }
    }else {
        next({ path: "/login" })
    }
})
  
// 跳转路由后触发
router.afterEach((to, from) => {
    NProgress.done()
})

export default router