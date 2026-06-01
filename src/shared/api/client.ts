import Config from 'react-native-config';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: unknown;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type QueueItem = {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
};

let authToken: string | null = null;
let isRefreshing = false;
let refreshQueue: QueueItem[] = [];

// Set by auth module at startup — avoids circular import
let onRefreshToken: (() => Promise<string>) | null = null;
let onLogout: (() => void) | null = null;

export const setAuthToken = (token: string | null) => {
  authToken = token;
};

export const configureClientInterceptors = (handlers: {
  refreshToken: () => Promise<string>;
  logout: () => void;
}) => {
  onRefreshToken = handlers.refreshToken;
  onLogout = handlers.logout;
};

const processQueue = (err: unknown, token: string | null) => {
  refreshQueue.forEach(({ resolve, reject }) => {
    if (err || token === null) {
      reject(err);
    } else {
      resolve(token);
    }
  });
  refreshQueue = [];
};

const request = async <T>(
  path: string,
  { body, headers, ...options }: RequestOptions = {},
): Promise<T> => {
  const response = await fetch(`${Config.API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (response.status === 401 && onRefreshToken) {
    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise<T>((resolve, reject) => {
        refreshQueue.push({
          resolve: (newToken) => {
            authToken = newToken;
            resolve(request<T>(path, { body, headers, ...options }));
          },
          reject,
        });
      });
    }

    isRefreshing = true;

    try {
      const newToken = await onRefreshToken();
      authToken = newToken;
      processQueue(null, newToken);
      return request<T>(path, { body, headers, ...options });
    } catch (err) {
      processQueue(err, null);
      onLogout?.();
      throw err;
    } finally {
      isRefreshing = false;
    }
  }

  if (!response.ok) {
    const text = await response.text().catch(() => response.statusText);
    throw new ApiError(response.status, text);
  }

  return response.json() as Promise<T>;
};

export const client = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'POST', body }),
  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PUT', body }),
  patch: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'PATCH', body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: 'DELETE' }),
};
