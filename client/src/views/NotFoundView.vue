<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-base-200">
    <h1 class="text-9xl font-bold text-error">404</h1>
    <h2 class="text-3xl font-semibold mt-4">Сторінку не знайдено</h2>
    <p class="mt-2 text-base-content/70">
      Вибачте, але користувач не авторизований, або такої сторінки не існує.
    </p>
    <router-link to="/" class="btn btn-primary mt-6">Повернутись на головну</router-link>
  </div>
</template>

<script setup lang="ts">
</script>