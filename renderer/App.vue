<script setup lang="ts">
import { cva, type VariantProps } from 'class-variance-authority';
import { onMounted, ref } from 'vue';

import { cn } from '~/utils/cn';

interface Props extends /* @vue-ignore */ VariantProps<typeof cssVariants> {
  class?: string;
}

const props = defineProps<Props>();

const cssVariants = cva(
  [
    ``,
  ],
  {
    variants: {},
    defaultVariants: {},
    compoundVariants: [],
  },
);

// IPC 통신 예시
const response = ref<string>('');
const isLoading = ref(false);
const isElectronAvailable = ref(false);

// 컴포넌트 마운트 시 window.electron 확인
onMounted(() => {
  // 짧은 지연 후 확인 (preload 스크립트 로드 대기)
  setTimeout(() => {
    isElectronAvailable.value = typeof window.electron !== 'undefined';
    if (!isElectronAvailable.value) {
      console.warn('window.electron is not available. Check if preload script is loaded.');
      response.value = 'Electron API를 사용할 수 없습니다. (preload 스크립트가 로드되지 않았습니다)';
    }
  }, 100);
});

const handlePing = async () => {
  if (!window.electron) {
    response.value = 'Electron API를 사용할 수 없습니다. (preload 스크립트가 로드되지 않았습니다)';
    return;
  }

  isLoading.value = true;
  try {
    const result = await window.electron.ping();
    response.value = result;
  }
  catch (error) {
    response.value = `에러 발생: ${error}`;
  }
  finally {
    isLoading.value = false;
  }
};
</script>

<template>
  <div :class='cn(cssVariants({}), props.class)'>
    <div class='p-8'>
      <h1 class='text-2xl font-bold mb-4'>
        IPC 통신 예시
      </h1>
      <button
        @click='handlePing'
        :disabled='isLoading'
        class='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
      >
        {{ isLoading ? '전송 중...' : 'Ping 보내기' }}
      </button>
      <div v-if='response' class='mt-4 p-4 bg-gray-100 rounded'>
        <p class='font-semibold'>
          응답:
        </p>
        <p>{{ response }}</p>
      </div>
    </div>
  </div>
</template>
