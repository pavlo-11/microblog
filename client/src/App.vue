<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore } from './stores/blogStore'
import { useRouter } from 'vue-router'

const store = useBlogStore()
const router = useRouter()
const isDark = ref(false)

// Збереження та перевірка теми при завантаженні
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})

// Типізація події та перемикання теми
const toggleTheme = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newTheme = target.checked ? 'dark' : 'light'
  isDark.value = target.checked
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

const handleLogout = () => {
  store.logout()
  router.push('/login')
}
</script>

<template>
  <div class="min-h-screen bg-base-200" :data-theme="isDark ? 'dark' : 'light'">
    <nav class="navbar bg-base-100 shadow-md px-6 sticky top-0 z-50">
      <div class="flex-1">
        <router-link to="/" class="btn btn-ghost normal-case text-2xl font-bold text-primary">MiniBlog</router-link>
      </div>
      <div class="flex-none gap-4" v-if="store.isLoggedIn">
        <label class="cursor-pointer flex items-center gap-2">
          <span class="text-sm font-semibold hidden sm:inline">Темна тема</span>
          <input type="checkbox" class="toggle toggle-primary" @change="toggleTheme" :checked="isDark" />
        </label>
        
        <router-link to="/create-post" class="btn btn-primary btn-sm">Створити пост</router-link>
        <router-link to="/create-author" class="btn btn-secondary btn-sm">Створити автора</router-link>
        <button @click="handleLogout" class="btn btn-outline btn-error btn-sm">Вийти</button>
      </div>
    </nav>

    <main class="p-6 container mx-auto">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore } from './stores/blogStore'
import { useRouter } from 'vue-router'

const store = useBlogStore()
const router = useRouter()

const isDark = ref(false)

// Збереження теми
onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light'
  isDark.value = savedTheme === 'dark'
  document.documentElement.setAttribute('data-theme', savedTheme)
})

// Типізація події event
const toggleTheme = (event: Event) => {
  const target = event.target as HTMLInputElement
  const newTheme = target.checked ? 'dark' : 'light'
  isDark.value = target.checked
  document.documentElement.setAttribute('data-theme', newTheme)
  localStorage.setItem('theme', newTheme)
}

const handleLogout = () => {
  store.logout()
  router.push('/login')
}
</script>

<style>
/* Плавність для елементів*/
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>