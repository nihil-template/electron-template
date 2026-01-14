import { app } from 'electron';

import { setupIpcHandlers } from './ipc';
import {
  createMainWindow,
  handleAppActivate,
  handleWindowAllClosed
} from './window/mainWindow';

app.whenReady().then(() => {
  // IPC 핸들러 등록
  setupIpcHandlers();

  // 메인 윈도우 생성
  createMainWindow();

  // 앱 활성화 이벤트 핸들러
  app.on('activate', handleAppActivate);
});

// 모든 윈도우가 닫혔을 때의 이벤트 핸들러
app.on('window-all-closed', handleWindowAllClosed);
