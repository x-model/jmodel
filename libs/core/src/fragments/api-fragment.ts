export type ApiError = {
  message: string;
};

export type ApiResult<T> = {
  data: T;
  error: ApiError;
};

export async function sendRequest<T>(request: Promise<T>) {
  try {
    const result = await request;
    return { data: result, error: null };
  } catch (error) {
    return Promise.resolve({ data: null, error });
  }
}
