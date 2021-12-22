// Imports
import Vue from 'vue'
import Router from 'vue-router'
// import { trailingSlash } from '@/util/helpers'
import {
  layout,
  route,
} from '@/util/routes'

Vue.use(Router)

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  scrollBehavior: (to, from, savedPosition) => {
    if (to.hash) return { selector: to.hash }
    if (savedPosition) return savedPosition

    return { x: 0, y: 0 }
  },
  routes: [
    layout('Default', [
      route('Dashboard'),

      // Pages
      route('User Profile', null, 'components/profile'),

      // Components
      route('Notifications', null, 'components/notifications'),
      route('Icons', null, 'components/icons'),
      route('Typography', null, 'components/typography'),

      // Tables
      route('Regular Tables', null, 'tables/regular'),
      route('Setup Products', null, 'setup/products'),

      // Maps
      route('Google Maps', null, 'maps/google'),
    ]),
    layout('Auth', [
      route('Login', null, 'auth/login'),
      route('Register', null, 'auth/register'),
    ]),
    layout('Home', [
      route('Home', null, 'home'),
      route('User Profile', null, 'profile'),
      route('Keranjang', null, 'keranjang'),
    ]),
    layout('Checkout', [
      route('CheckoutSuccess', null, 'checkout/success'),
    ]),
  ],
})

router.beforeEach((to, from, next) => {
  // return to.path.endsWith('/') ? next() : next(trailingSlash(to.path))
  const isAuth = localStorage.getItem('isAuth')

  if (to.path !== '/auth/login' && !isAuth) {
    if (to.path === '/auth/register') {
      return next()
    } else {
      return next({ path: '/auth/login' })
    }
  } else if (to.path === '/auth/login' && isAuth) {
    return next()
  }
  next()
})

export default router
