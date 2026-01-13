/**
 * Electron API 타입 정의
 */
interface ElectronAPI {
  /**
   * ping을 보내고 pong 응답을 받습니다.
   * @returns Promise<string> 'pong' 문자열을 반환합니다.
   */
  ping: () => Promise<string>;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}

export {};
