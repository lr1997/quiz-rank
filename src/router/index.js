import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/quiz',
    name: 'Quiz',
    component: () => import('../views/quiz/QuizView.vue')
  },
  {
    path: '/quiz/result',
    name: 'QuizResult',
    component: () => import('../views/quiz/QuizResult.vue')
  },{
  path: '/video/:videoId',
  name: 'VideoLearn',
  component: () => import('../views/study/VideoLearn.vue')
}
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router