import { queryClient } from "@/components/Provider";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";
export const refresh = (queryKey: string[]) =>
  queryClient.invalidateQueries({ queryKey });

type ApiOptions = Omit<RequestInit, "body" | "headers"> & { body?: unknown };

// Small fetch wrapper for the Spring Boot server.
// Objects are sent as JSON, FormData (file upload) is sent as it is.
export async function api<T = void>(
  endpoint: string,
  { body, ...options }: ApiOptions = {},
): Promise<T> {
  const isFormData = body instanceof FormData;

  const res = await fetch(`${baseURL}/${endpoint}`, {
    ...options,
    headers: isFormData ? undefined : { "Content-Type": "application/json" },
    body:
      body === undefined ? undefined : isFormData ? body : JSON.stringify(body),
  });

  const text = await res.text();
  if (!res.ok) throw new Error(`${res.status}: ${text}`);

  // Spring `void` endpoints answer with an empty body (200 or 204)
  return (text ? JSON.parse(text) : undefined) as T;
}
