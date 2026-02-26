<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useBlogStore, type Author } from '../stores/blogStore'

const route = useRoute()
const router = useRouter()
const store = useBlogStore()

const selectedCategory = ref<string>('')
const authorId = computed<string>(() => String(route.params.id))
const displayCount = ref(0)

const author = computed<Author | undefined>(() => {
  return store.getAuthorById(authorId.value)
})

const filteredPosts = computed(() => {
  let posts = store.posts.filter(p => String(p.author.id) === authorId.value)
  
  if (selectedCategory.value) {
    posts = posts.filter(p => p.category === selectedCategory.value)
  }
  return posts
})

const totalPosts = computed(() => filteredPosts.value.length)

// Анімація зворотнього відліку
watch(totalPosts, (newVal) => {
  setTimeout(() => {
    displayCount.value = newVal
  }, 500)
}, { immediate: true })

onMounted(async () => {
  if (store.authors.length === 0) await store.fetchAuthors()
  if (store.posts.length === 0) await store.fetchPosts()
})
</script>

<template>
  <div class="max-w-7xl mx-auto" v-if="author">
    <div class="flex items-center mb-10 bg-base-100 shadow-xl p-8 rounded-2xl border border-base-300">
      <div class="avatar">
        <div class="w-24 h-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
          <img :src="author.avatar" alt="Avatar" />
        </div>
      </div>
      <h1 class="text-4xl font-bold ml-6">{{ author.name }}</h1>
    </div>

    <div class="mb-6 flex flex-wrap gap-3 bg-base-100 p-4 rounded-xl shadow-sm border border-base-300">
      <span class="font-semibold flex items-center mr-2">Фільтр:</span>
      <button 
        class="btn btn-sm" 
        :class="selectedCategory === '' ? 'btn-primary' : 'btn-ghost'"
        @click="selectedCategory = ''"
      >Всі</button>
      
      <button 
        v-for="cat in Object.values(store.postTypes)" 
        :key="cat"
        class="btn btn-sm" 
        :class="selectedCategory === cat ? 'btn-primary' : 'btn-ghost'"
        @click="selectedCategory = String(cat)"
      >{{ cat }}</button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div v-for="post in filteredPosts" :key="post.id" class="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
        <div class="card-body">
          <h2 class="card-title text-2xl">{{ post.title }}</h2>
          <div class="badge badge-secondary mt-1">{{ post.category }}</div>
          <p class="mt-4 text-base-content/80">{{ post.description }}</p>
        </div>
      </div>
      
      <div v-if="filteredPosts.length === 0" class="col-span-full flex flex-col items-center justify-center py-20 bg-base-100 rounded-2xl border border-base-300 shadow-sm">
        <span class="text-6xl mb-4">📭</span>
        <h3 class="text-2xl font-bold text-base-content/60">Немає постів у цій категорії</h3>
      </div>
    </div>
  </div>
  
  <div v-else class="p-6 text-center mt-20 flex flex-col items-center">
    <span class="text-8xl mb-6">🤷‍♂️</span>
    <h2 class="text-4xl font-bold text-error">Автора не знайдено</h2>
    <button class="btn btn-primary mt-8" @click="router.push('/')">Повернутись на головну</button>
  </div>
</template>