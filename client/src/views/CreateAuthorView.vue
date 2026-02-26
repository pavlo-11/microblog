<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useBlogStore } from '../stores/blogStore'
import { useRouter } from 'vue-router'

const store = useBlogStore()
const router = useRouter()

const name = ref<string>('')
const selectedAvatar = ref<string>('')

// Перевірка доступу
onMounted(() => {
  if (!store.isLoggedIn) {
    alert('Only authorized users can create authors!')
    router.push('/login')
  } else {
    // Встановлюємо дефолтний аватар
    selectedAvatar.value = store.availableAvatars[0]
  }
})

async function submitAuthor() {
  if (!name.value || !selectedAvatar.value) return
  
  try {
    const response = await store.createAuthor({ name: name.value, avatar: selectedAvatar.value })
    if (response && response.id) {
       router.push(`/author/${response.id}`)
    } else {
       router.push('/')
    }
  } catch (error) {
    console.error('Помилка створення автора:', error)
  }
}
</script>

<template>
  <div class="p-6 max-w-md mx-auto">
    <h1 class="text-3xl font-bold mb-6">Створити автора</h1>
    <form @submit.prevent="submitAuthor" class="flex flex-col gap-4 bg-base-200 p-6 rounded-2xl">
      <div class="form-control">
        <label class="label"><span class="label-text font-semibold">Ім'я автора</span></label>
        <input v-model="name" type="text" required class="input input-bordered" placeholder="Введіть ім'я..." />
      </div>
      
      <div class="form-control">
        <label class="label"><span class="label-text font-semibold">Оберіть аватар</span></label>
        <div class="flex gap-4 flex-wrap mt-2">
          <img 
            v-for="avatar in store.availableAvatars" 
            :key="avatar" 
            :src="avatar" 
            @click="selectedAvatar = avatar"
            class="w-16 h-16 rounded-full cursor-pointer border-4 transition-all hover:scale-110"
            :class="selectedAvatar === avatar ? 'border-primary scale-110 shadow-lg' : 'border-transparent'"
          />
        </div>
      </div>

      <button type="submit" class="btn btn-primary mt-6" :disabled="!selectedAvatar || !name">
        Створити автора
      </button>
    </form>
  </div>
</template>