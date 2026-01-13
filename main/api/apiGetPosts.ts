import { ipcMain } from 'electron';

import { apiClient } from './index';

/**
 * Posts 목록 조회 API 함수
 * JSONPlaceholder의 /posts 엔드포인트를 호출합니다.
 * @returns Posts 목록 데이터
 */
export async function apiGetPosts() {
  const response = await apiClient.get('/posts');
  return response.data;
}

/**
 * IPC 핸들러 등록
 * 함수명 규칙: ipc<행위><대상> (IPC 핸들러 등록용)
 */
export function ipcGetPosts() {
  ipcMain.handle('api:get-posts', async () => {
    return await apiGetPosts();
  });
}
