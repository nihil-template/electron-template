import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  /**
   * IPC 통신 함수들
   */
  ipc: {
    /**
     * ping을 보내고 pong 응답을 받습니다.
     * @returns Promise<string> 'pong' 문자열을 반환합니다.
     */
    ping: () => ipcRenderer.invoke('ipc:ping'),
  },

  /**
   * API 요청 함수들
   * 개발/운영 환경 모두 Main Process를 통해 요청합니다.
   * Main Process에서 요청/응답 로그를 출력합니다.
   */
  api: {
    /**
     * 사용자 조회
     * @param userId 사용자 ID
     * @returns 사용자 데이터
     */
    getUser: (userId: string) => ipcRenderer.invoke('api:get-user', userId),
    /**
     * Posts 목록 조회
     * @returns Posts 목록 데이터
     */
    getPosts: () => ipcRenderer.invoke('api:get-posts'),
  },
});

// Preload 스크립트가 로드되었는지 확인하기 위한 로그
console.log('Preload script loaded successfully');
