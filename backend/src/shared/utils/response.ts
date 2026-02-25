import { Context } from 'hono';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
  };
}

export class ResponseHelper {
  static success<T>(c: Context, data: T, status: number = 200) {
    const response: ApiResponse<T> = {
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    return c.json(response, status);
  }

  static error(
    c: Context,
    code: string,
    message: string,
    status: number = 400,
    details?: any
  ) {
    const response: ApiResponse = {
      success: false,
      error: {
        code,
        message,
        details,
      },
      meta: {
        timestamp: new Date().toISOString(),
      },
    };
    return c.json(response, status);
  }

  static created<T>(c: Context, data: T) {
    return this.success(c, data, 201);
  }

  static noContent(c: Context) {
    return c.body(null, 204);
  }
}
