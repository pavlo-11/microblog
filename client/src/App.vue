<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore } from './stores/blogStore'
import { useRouter } from 'vue-router'

const store = useBlogStore()
const router = useRouter()
const isDark = ref(false)

// 1. Логіка теми
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
        </label>

        <div v-if="store.isLoggedIn" class="flex gap-2">
          <router-link to="/create-author" class="btn btn-outline btn-primary btn-sm hidden md:flex">Новий автор</router-link>
          <router-link to="/create-post" class="btn btn-primary btn-sm">Новий пост</router-link>
          <button @click="handleLogout" class="btn btn-ghost btn-sm text-error">Вихід</button>
        </div>
        <router-link v-else to="/login" class="btn btn-primary btn-sm px-6">Вхід</router-link>
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
        <p class="font-bold">Мікроблог</p> 
        <p>Нємец Павло АТ-241</p>
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