import { createRouter, createWebHashHistory } from 'vue-router'
import tkambioApi from '../api/tkambioApi'  // Asegúrate de importar tu API aquí
import ReportView from '../views/reports/ReportView.vue'
import LoginView from '../views/authentication/LoginView.vue'
import { getAuthHeaders } from '../utils/getAuthHeaders'

const routes = [
    {
        path: '/report',
        name: 'ReportView',
        component: ReportView,
        meta: { requiresAuth: true },
    },
    {
        path: '/login',
        name: 'LoginView',
        component: LoginView,
    },
    {
        path: '/',
        redirect: '/login',
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('token')

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!token) {
            return next('/login')
        }
        try {
            const response = await tkambioApi.get('/validate-token', getAuthHeaders())
            if (response.data) {
                return next()
            } else {
                localStorage.removeItem('token')
                return next('/login')
            }
        } catch (error) {
            localStorage.removeItem('token')
            return next('/login')
        }
    }

    next()
})


export default router
