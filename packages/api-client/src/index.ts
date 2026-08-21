import type { ApiError, ApiSuccess } from "@voynue/types";

export class VoynueApiClient {
  constructor(private readonly baseUrl: string, private readonly token?: () => Promise<string | null>) {}
  async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const bearer = await this.token?.();
    const response = await fetch(`${this.baseUrl}${path}`, { ...init, headers: { "content-type": "application/json", ...(bearer ? { authorization: `Bearer ${bearer}` } : {}), ...init.headers } });
    const payload = await response.json() as ApiSuccess<T> | ApiError;
    if (!response.ok || "error" in payload) throw new Error("error" in payload ? `${payload.error.message} (${payload.error.referenceId})` : `Request failed (${response.status})`);
    return payload.data;
  }
}
