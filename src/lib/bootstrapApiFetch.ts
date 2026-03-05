import { getApiUrl } from "@/lib/api-config";

let fetchPatched = false;

function rewriteApiUrl(rawUrl: string): string {
  if (rawUrl.startsWith("/api")) {
    const suffix = rawUrl.slice("/api".length).replace(/^\/+/, "");
    return getApiUrl(suffix);
  }

  if (!/^https?:\/\//i.test(rawUrl)) {
    return rawUrl;
  }

  if (typeof window === "undefined") {
    return rawUrl;
  }

  try {
    const parsed = new URL(rawUrl);
    if (parsed.origin !== window.location.origin) {
      return rawUrl;
    }

    if (!parsed.pathname.startsWith("/api")) {
      return rawUrl;
    }

    const suffix = parsed.pathname
      .slice("/api".length)
      .replace(/^\/+/, "");

    const target = new URL(getApiUrl(suffix));
    target.search = parsed.search;
    target.hash = parsed.hash;
    return target.toString();
  } catch {
    return rawUrl;
  }
}

export function bootstrapApiFetch(): void {
  if (typeof window === "undefined" || fetchPatched) {
    return;
  }

  const nativeFetch = window.fetch.bind(window);

  window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
    if (typeof input === "string") {
      return nativeFetch(rewriteApiUrl(input), init);
    }

    if (input instanceof URL) {
      return nativeFetch(new URL(rewriteApiUrl(input.toString())), init);
    }

    const rewrittenUrl = rewriteApiUrl(input.url);
    if (rewrittenUrl === input.url) {
      return nativeFetch(input, init);
    }

    return nativeFetch(new Request(rewrittenUrl, input), init);
  };

  fetchPatched = true;
}
