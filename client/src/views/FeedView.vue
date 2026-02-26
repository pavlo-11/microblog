<script setup lang="ts">
import { onMounted } from 'vue'
import { useBlogStore } from '../stores/blogStore'
import { useRouter } from 'vue-router'

const store = useBlogStore()
const router = useRouter()

onMounted(async () => {
  await store.fetchAuthors()
  await store.fetchPosts()
})

function goToAuthor(id: string | number) {
  router.push(`/author/${id}`)
}
</script>

<template>
  <div class="max-w-7xl mx-auto">
    <div class="flex justify-between items-end mb-8">
      <h1 class="text-4xl font-black">Стрічка постів</h1>
    </div>
    
    <div v-if="store.isLoading" class="flex justify-center mt-20">
      <span class="loading loading-spinner loading-lg text-primary"></span>
    </div>
    
    <div v-else-if="store.posts.length === 0" class="text-center mt-20 text-base-content/50 text-xl font-semibold">
      Постів ще немає. Будьте першим!
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="post in store.posts" :key="post.id" class="card bg-base-100 shadow-xl border border-base-300 hover:-translate-y-1 transition-transform">
        <div class="card-body">
          <h2 class="card-title text-2xl mb-1">{{ post.title }}</h2>
          <div><span class="badge badge-secondary font-bold">{{ post.category }}</span></div>
          <p class="mt-4 text-base-content/80 flex-grow">{{ post.description }}</p>
          
          <div class="divider my-2"></div>
          
          <div class="flex items-center mt-2 cursor-pointer hover:bg-base-200 p-2 -mx-2 rounded-xl transition-colors" @click="goToAuthor(post.author.id)">
            <div class="avatar">
              <div class="w-10 h-10 rounded-full border-2 border-primary">
                <img :src="post.author.avatar" alt="Avatar" />
              </div>
            </div>
            <div class="ml-3">
              <p class="text-sm text-base-content/60 m-0 leading-tight">Автор</p>
              <p class="font-bold hover:text-primary transition-colors m-0 leading-tight">{{ post.author.name }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>