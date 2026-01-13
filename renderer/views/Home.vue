<script setup lang="ts">
import { onMounted, ref } from 'vue';

import type { Post } from '~/types/electron';

const posts = ref<Post[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

const loadPosts = async () => {
  if (!window.electron) {
    error.value = 'Electron API를 사용할 수 없습니다.';
    return;
  }

  isLoading.value = true;
  error.value = null;

  try {
    const data = await window.electron.api.getPosts();
    posts.value = data;
  }
  catch (err) {
    error.value = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
    console.error('Posts 로드 실패:', err);
  }
  finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  loadPosts();
});
</script>

<template>
  <div class='p-8'>
    <h1 class='text-h1 font-bold mb-6'>
      Posts 목록
    </h1>

    <div v-if='isLoading' class='text-center py-8'>
      <p class='text-gray-600'>
        로딩 중...
      </p>
    </div>

    <div v-else-if='error' class='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4'>
      <p class='font-semibold'>
        오류:
      </p>
      <p>{{ error }}</p>
    </div>

    <div v-else-if='posts.length === 0' class='text-center py-8'>
      <p class='text-gray-600'>
        Posts가 없습니다.
      </p>
    </div>

    <div v-else class='space-y-4'>
      <div
        v-for='post in posts'
        :key='post.id'
        class='bg-white border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow'
      >
        <h2 class='text-h5 font-semibold mb-2 text-gray-800'>
          {{ post.title }}
        </h2>
        <p class='text-gray-600 mb-3'>
          {{ post.body }}
        </p>
        <div class='text-sm text-gray-500'>
          <span>User ID: {{ post.userId }}</span>
          <span class='mx-2'>
            |
          </span>
          <span>Post ID: {{ post.id }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
