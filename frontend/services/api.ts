const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/graphql/";

export const TOKEN_KEY = "mali-token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch {}
}

export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
  } catch {}
}

export async function graphql<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) headers["Authorization"] = `JWT ${token}`;

  const res = await fetch(API_URL, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors && json.errors.length) {
    throw new Error(json.errors[0].message);
  }
  return json.data as T;
}
