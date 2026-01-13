import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  /**
   * ping을 보내고 pong 응답을 받습니다.
   * @returns Promise<string> 'pong' 문자열을 반환합니다.
   */
  ping: () => ipcRenderer.invoke('ping'),
});

// Preload 스크립트가 로드되었는지 확인하기 위한 로그
console.log('Preload script loaded successfully');
