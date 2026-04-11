import { API_BASE, fetchWithAuth, getAccessToken } from "@/lib/api";
import type { SparePartResponse } from "@/types/api";

/** Build full image URL for spare part image paths. */
export function sparePartImageUrl(url: string | undefined | null): string {
  if (!url) return "";
  return url.startsWith("http") ? url : `${API_BASE}${url}`;
}

async function parseJson<T>(res: Response): Promise<T> {
  const text = await res.text();
  let data: T;
  try {
    data = text ? (JSON.parse(text) as T) : ({} as T);
  } catch {
    throw new Error(text || res.statusText || "Invalid response");
  }
  if (!res.ok) {
    const msg = (data as any)?.detail ?? (data as any)?.message ?? text;
    throw new Error(Array.isArray(msg) ? msg.map((e: any) => e.msg || e).join(", ") : String(msg));
  }
  return data;
}

/** List all spare parts. */
export async function getSpareParts(): Promise<SparePartResponse[]> {
  const res = await fetchWithAuth("/spare-parts/");
  return parseJson<SparePartResponse[]>(res);
}



/** Create a spare part with multipart form (requires admin auth). */
export async function createSparePart(formData: FormData): Promise<SparePartResponse> {
  const token = getAccessToken();
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  
  const res = await fetch(`${API_BASE}/spare-parts/`, {
    method: "POST",
    headers,
    body: formData,
  });
  return parseJson<SparePartResponse>(res);
}

/** Update a spare part with multipart form (requires admin auth). */
export async function updateSparePart(partId: number, formData: FormData): Promise<SparePartResponse> {
  const token = getAccessToken();
  const headers: HeadersInit = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}/spare-parts/${partId}`, {
    method: "PUT",
    headers,
    body: formData,
  });
  return parseJson<SparePartResponse>(res);
}

/** Delete a spare part by id (requires admin auth). */
export async function deleteSparePart(partId: number): Promise<void> {
  const res = await fetchWithAuth(`/spare-parts/${partId}`, { method: "DELETE" });
  if (!res.ok) {
    const text = await res.text();
    let detail: unknown;
    try {
      detail = text ? JSON.parse(text) : {};
    } catch {
      throw new Error(text || "Failed to delete spare part");
    }
    throw new Error((detail as any)?.detail ?? text);
  }
}
