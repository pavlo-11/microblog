<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore } from '../stores/blogStore'
import { useRouter } from 'vue-router'

const store = useBlogStore()
const router = useRouter()

const title = ref<string>('')
const description = ref<string>('')
const category = ref<string>('')
const selectedAuthorId = ref<string | number>('')
const isLoading = ref(false)

// Перевірка доступу та завантаження авторів
onMounted(async () => {
  if (!store.isLoggedIn) {
    alert('Only authorized users can create posts!')
    router.push('/login')
    return
  }
  if (store.authors.length === 0) {
    await store.fetchAuthors()
  }
})

async function submitPost() {
  const author = store.authors.find(a => String(a.id) === String(selectedAuthorId.value))
  if (!author) return

  const postData = {
    title: title.value,
    description: description.value,
    category: category.value,
    author: author 
  }

  try {
    isLoading.value = true
    await store.createPost(postData)
    router.push('/')
  } catch (error) {
    console.error('Помилка при створенні:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="max-w-lg mx-auto pt-10">
    <div class="card bg-base-100 shadow-2xl border border-base-300">
      <div class="card-body">
        <h1 class="text-3xl font-bold mb-4 text-center">Створити пост</h1>
        
        <form @submit.prevent="submitPost" class="flex flex-col gap-4">
          <div class="form-control">
            <label class="label"><span class="label-text font-bold">Заголовок</span></label>
            <input v-model="title" type="text" required class="input input-bordered focus:input-primary" placeholder="Введіть заголовок..." />
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text font-bold">Опис</span></label>
            <textarea v-model="description" required class="textarea textarea-bordered focus:textarea-primary h-32" placeholder="Про що ваш пост?"></textarea>
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text font-bold">Категорія</span></label>
            <select v-model="category" required class="select select-bordered focus:select-primary">
              <option disabled value="">Оберіть категорію</option>
              <option v-for="cat in store.postTypes" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>

          <div class="form-control">
            <label class="label"><span class="label-text font-bold">Автор</span></label>
            <select v-model="selectedAuthorId" required class="select select-bordered focus:select-primary">
              <option disabled value="">Оберіть автора</option>
              <option v-for="author in store.authors" :key="author.id" :value="author.id">{{ author.name }}</option>
            </select>
          </div>

          <button type="submit" class="btn btn-primary mt-6 text-lg" :disabled="!title || !description || !category || !selectedAuthorId || isLoading">
            <span v-if="isLoading" class="loading loading-spinner"></span>
            Опублікувати
          </button>
        </form>
      </div>
    </div>
  </div>
</template>