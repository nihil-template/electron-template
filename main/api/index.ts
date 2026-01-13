import appConfig from '@config/app.json';
import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * axios 인스턴스 생성 및 설정
 * 설정은 config/app.json에서 직접 import합니다.
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: appConfig.api.baseURL,
  timeout: appConfig.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 요청 인터셉터
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 요청 전 처리 (예: 토큰 추가)
    // const token = getAuthToken();
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    // 요청 로그 출력
    const endpoint = `${config.method?.toUpperCase()} ${config.url || ''}`;
    const query = config.params
      ? JSON.stringify(config.params)
      : undefined;
    const body = config.data
      ? JSON.stringify(config.data)
      : undefined;

    console.log('[API Request]', {
      endpoint,
      query,
      body,
    });

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 응답 인터셉터
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 응답 성공 로그 출력
    const endpoint = `${response.config.method?.toUpperCase()} ${response.config.url || ''}`;
    const statusCode = response.status;
    const body = response.data
      ? JSON.stringify(response.data)
      : undefined;

    console.log('[API Response]', {
      endpoint,
      statusCode,
      body,
    });

    return response;
  },
  (error) => {
    // 응답 에러 로그 출력
    if (error.response) {
      // 서버 응답이 있는 경우
      const endpoint = `${error.config?.method?.toUpperCase()} ${error.config?.url || ''}`;
      const statusCode = error.response.status;
      const body = error.response.data
        ? JSON.stringify(error.response.data)
        : undefined;

      console.error('[API Error Response]', {
        endpoint,
        statusCode,
        body,
      });
    }
    else if (error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      const endpoint = `${error.config?.method?.toUpperCase()} ${error.config?.url || ''}`;
      console.error('[API Error]', {
        endpoint,
        message: 'No response received',
      });
    }
    else {
      // 요청 설정 중 에러가 발생한 경우
      console.error('[API Error]', {
        message: error.message,
      });
    }
    return Promise.reject(error);
  }
);

// 모든 API 함수를 import하고 export하는 통합 역할
export { apiGetUser, ipcGetUser } from './apiGetUser';
export { apiGetPosts, ipcGetPosts } from './apiGetPosts';
// 새로운 API 함수를 추가할 때마다 여기에 export 추가
