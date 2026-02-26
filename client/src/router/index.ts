import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import FeedView from '../views/FeedView.vue'
import LoginView from '../views/LoginView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import CreateAuthorView from '../views/CreateAuthorView.vue'
import AuthorProfileView from '../views/AuthorProfileView.vue'
import NotFoundView from '../views/NotFoundView.vue'
import { useBlogStore } from '../stores/blogStore'

const routes: Array<RouteRecordRaw> = [
  { path: '/login', name: 'Login', component: LoginView },
  { path: '/', name: 'Feed', component: FeedView, meta: { requiresAuth: true } },
  { path: '/create-post', name: 'CreatePost', component: CreatePostView, meta: { requiresAuth: true } },
  { path: '/create-author', name: 'CreateAuthor', component: CreateAuthorView, meta: { requiresAuth: true } },
  { path: '/author/:id', name: 'AuthorProfile', component: AuthorProfileView, meta: { requiresAuth: true } },
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFoundView }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const store = useBlogStore()
  const isAuthenticated = store.isLoggedIn

  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'NotFound' })
  } else if (to.name === 'Login' && isAuthenticated) {
    next({ name: 'Feed' })
  } else {
    next()
  }
})

export default router