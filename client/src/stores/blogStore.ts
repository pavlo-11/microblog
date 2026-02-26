import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

// 1. Створюємо інтерфейси для наших даних
export interface Author {
  id: string | number;
  name: string;
  avatar: string;
}

export interface Post {
  id: string | number;
  title: string;
  description: string;
  category: string;
  author: Author;
  createdAt?: string;
}

export const useBlogStore = defineStore('blog', () => {
  // 2. Типізуємо Refs
  const authors = ref<Author[]>([])
  const posts = ref<Post[]>([])
  const isLoading = ref<boolean>(false)
  
  // Зчитуємо початковий стан з localStorage
  const isLoggedIn = ref<boolean>(localStorage.getItem('isLoggedIn') === 'true')

  const availableAvatars = [
    '/avatars/vi.png',
    '/avatars/jinx.png', 
    '/avatars/caitlyn.png',
    '/avatars/ekko.png',
    '/avatars/heimerdinger.png',
    '/avatars/mel.png',
    '/avatars/poro.png'
  ]

  const postTypes = {
    Games: 'Games',
    Sports: 'Sport',
    Study: 'Study',
    Life: 'Life'
  }

  // Логін (простий)
  function login() {
    isLoggedIn.value = true
    localStorage.setItem('isLoggedIn', 'true')
  }

  // Логаут
  function logout() {
    isLoggedIn.value = false
    localStorage.removeItem('isLoggedIn')
  }

  // Завантаження постів
  async function fetchPosts() {
    isLoading.value = true
    try {
      const response = await api.get('/posts')
      posts.value = response.data
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Завантаження авторів
  async function fetchAuthors() {
    try {
      const response = await api.get('/authors')
      authors.value = response.data
    } catch (error) {
      console.error('Error fetching authors:', error)
    }
  }

  // Створення автора
  async function createAuthor(authorData: { name: string; avatar: string }) {
    try {
      const response = await api.post('/authors', authorData)
      authors.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating author:', error)
      throw error
    }
  }

  // Створення поста
  async function createPost(postData: any) {
    try {
      const response = await api.post('/posts', postData)
      posts.value.push(response.data)
      return response.data
    } catch (error) {
      console.error('Error creating post:', error)
      throw error
    }
  }

  const getAuthorById = computed(() => {
    return (id: string | number) => authors.value.find((a) => a.id == id)
  })

  return {
    authors,
    posts,
    isLoading,
    isLoggedIn,
    availableAvatars,
    postTypes,
    login,
    logout,
    fetchPosts,
    fetchAuthors,
    createAuthor,
    createPost,
    getAuthorById
  }
})