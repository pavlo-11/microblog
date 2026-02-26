<script setup lang="ts">
import { ref } from 'vue'
import { useBlogStore } from '../stores/blogStore'
import { useRouter } from 'vue-router'
import api from '../services/api'

const store = useBlogStore()
const router = useRouter()

const username = ref<string>('')
const password = ref<string>('')
const errorMessage = ref<string>('')
const isLoading = ref<boolean>(false)

async function handleLogin() {
  errorMessage.value = ''
  isLoading.value = true
  
  try {
    const res = await api.post('/login', {
      username: username.value,
      password: password.value
    })
    
    if (res.status === 200) {
      store.login()
      router.push('/')
    }
  } catch (error: any) {
    errorMessage.value = error.response?.data?.message || 'Невірний логін або пароль! (Спробуй: admin / 123)'
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[80vh] flex flex-col items-center justify-center">
    <div class="card w-full max-w-sm shadow-2xl bg-base-200">
      <div class="card-body">
        <h2 class="text-3xl font-bold text-center mb-4">Вхід</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-control">
            <label class="label"><span class="label-text">Логін</span></label>
            <input v-model="username" type="text" placeholder="Введіть логін..." required class="input input-bordered" />
          </div>
          <div class="form-control mt-4">
            <label class="label"><span class="label-text">Пароль</span></label>
            <input v-model="password" type="password" placeholder="Введіть пароль..." required class="input input-bordered" />
          </div>
          
          <p v-if="errorMessage" class="text-error text-sm mt-3 text-center">{{ errorMessage }}</p>
          
          <div class="form-control mt-6">
            <button type="submit" class="btn btn-primary" :disabled="isLoading">
              <span v-if="isLoading" class="loading loading-spinner"></span>
              Увійти
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>