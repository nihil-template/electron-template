import { ipcMain } from 'electron';

import { apiClient } from './index';

/**
 * 사용자 조회 API 함수
 * @param userId 사용자 ID
 * @returns 사용자 데이터
 */
export async function apiGetUser(userId: string) {
  const response = await apiClient.get(`/users/${userId}`);
  return response.data;
}

/**
 * IPC 핸들러 등록 (운영 환경용)
 * 함수명 규칙: ipc<행위><대상> (IPC 핸들러 등록용)
 */
export function ipcGetUser() {
  ipcMain.handle('api:get-user', async (_event, userId: string) => {
    return await apiGetUser(userId);
  });
}
