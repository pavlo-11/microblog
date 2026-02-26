<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore } from './stores/blogStore'
import { useRouter } from 'vue-router'

const store = useBlogStore()
const router = useRouter()
const isDark = ref(false)

// 1. Логіка теми (об'єднана)
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})

const toggleTheme = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newTheme = target.checked ? 'dark' : 'light'
  isDark.value = target.checked
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

// 2. Логіка виходу
const handleLogout = () => {
  store.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-base-200 transition-colors duration-300">
    <div class="navbar bg-base-100 shadow-md px-4 md:px-8">
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost text-xl normal-case gap-2">
          <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <span class="font-bold">M</span>
          </div>
          <span class="hidden sm:inline">MicroBlog</span>
        </router-link>
      </div>

      <div class="flex-none gap-4">
        <label class="swap swap-rotate btn btn-ghost btn-circle">
          <input type="checkbox" :checked="isDark" @change="toggleTheme" />
          <svg class="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,17.66l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,18.36,17ZM12,6a6,6,0,1,0,6,6A6,6,0,0,0,12,6Z"/></svg>
          <svg class="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z"/></svg>
        </label>

        <div v-if="store.isLoggedIn" class="flex gap-2">
          <router-link to="/create-author" class="btn btn-outline btn-primary btn-sm hidden md:flex">New Author</router-link>
          <router-link to="/create-post" class="btn btn-primary btn-sm">New Post</router-link>
          <button @click="handleLogout" class="btn btn-ghost btn-sm text-error">Logout</button>
        </div>
        <router-link v-else to="/login" class="btn btn-primary btn-sm px-6">Login</router-link>
      </div>
    </div>

    <main class="container mx-auto p-4 md:p-8">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <footer class="footer footer-center p-10 bg-base-100 text-base-content border-t border-base-300 mt-auto">
      <aside>
        <p class="font-bold">MicroBlog Admin Panel</p> 
        <p>Copyright © 2024 - All right reserved</p>
      </aside>
    </footer>
  </div>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

[data-theme='dark'] {
  color-scheme: dark;
}
</style>