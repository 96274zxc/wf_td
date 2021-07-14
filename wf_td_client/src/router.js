import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Register from './components/Register.vue'
import Index from './components/Index.vue'
import Home from './components/Home.vue'
import Welcome from './components/home/Welcome.vue'
import User from './components/home/User.vue'
import Avater from './components/home/Avater.vue'
import Mod from './components/home/Mod.vue'
import Sale from './components/home/Sale.vue'
import Comment from './components/home/Comment.vue'

Vue.use(Router)

const router = new Router({
    routes: [
        { path: '/', redirect: '/index' },
        { path: '/login', component: Login },
        { path: '/register', component: Register },
        { path: '/index', component: Index },
        { path: '/comment', component: Comment },
        {
            path: '/home',
            component: Home,
            redirect: '/welcome',
            children: [
                { path: '/welcome', component: Welcome },
                { path: '/user', component: User },
                { path: '/avater', component: Avater },
                { path: '/mod', component: Mod },
                { path: '/sale', component: Sale }
            ]
        }
    ]
});

// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to 将要访问的路径
    // from 代表从哪个路径跳转而来
    // next 是一个函数，表示放行
    // next() 放行 next('/login') 强制跳转
    if (to.path === '/login') return next();
    if (to.path === '/register') return next();
    if (to.path === '/index') return next();
    // 获取token
    const tokenStr = window.sessionStorage.getItem('token');
    if (!tokenStr) return next('/login');
    next();
});

export default router;