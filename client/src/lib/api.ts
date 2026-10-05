import { QueryClient, useQueryClient } from "@tanstack/react-query";

const baseURL = "http://localhost:8080";
type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
};
export async function api<T>(
  endpoint: string,
  options: ApiOptions = {},
): Promise<T> {
  const { body, headers, ...rest } = options;

  const isFormData = body instanceof FormData;

  const res = await fetch(`${baseURL}/${endpoint}`, {
    ...rest,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...headers,
    },
    body: isFormData
      ? body
      : body === undefined
        ? undefined
        : JSON.stringify(body),
  });

  if (!res.ok) {
    const message = await res.text();
    throw new Error(`${res.status}: ${message}`);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json() as Promise<T>;
}
