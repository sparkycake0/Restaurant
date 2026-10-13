import { queryClient } from "@/components/Provider";

const endpoint =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/graphql";

export const refresh = (queryKey: string[]) =>
  queryClient.invalidateQueries({ queryKey });

// Sends one GraphQL query or mutation to the Spring Boot server and returns its `data`.
// If the server answers with errors, the first error message is thrown.
export async function gql<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);

  const json = await res.json();
  if (json.errors?.length) throw new Error(json.errors[0].message);

  return json.data as T;
}
