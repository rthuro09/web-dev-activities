export const API_CONFIG = {
  baseUrl: "dragonball-api.com",
  endpoint: "/api/characters",
  searchParam: "name",
  pageParam: "page",
  pageSizeParam: "limit",
  pageSize: 8,
  timeoutMs: 15000
};

function buildUrl(parameters = {}) {
  const url = new URL(API_CONFIG.endpoint, API_CONFIG.baseUrl);
  for (const [key, value] of Object.entries(parameters)) {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }
  return url;
}

function normalizeCharacters(payload) {
  const records = Array.isArray(payload) ? payload : payload?.items;
  if (!Array.isArray(records)) {
    throw new Error("The character API returned an unexpected response format.");
  }
  return {
    items: records.filter((record) => record && typeof record === "object" && record.name),
    meta: payload?.meta ?? null
  };
}

async function requestCharacters(url, signal) {
  const controller = new AbortController();
  let timedOut = false;
  const abortRequest = () => controller.abort();
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, API_CONFIG.timeoutMs);
  signal?.addEventListener("abort", abortRequest, { once: true });

  if (signal?.aborted) {
    abortRequest();
  }

  try {
    let response;
    try {
      response = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: controller.signal
      });
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }
      if (timedOut) {
        throw new Error("The Dragon Ball API took too long to respond. Please try again.");
      }
      if (error?.name === "AbortError") {
        throw error;
      }
      throw new Error("Could not reach the Dragon Ball API. Check your connection, API availability, or CORS settings.");
    }

    if (!response.ok) {
      throw new Error(`The Dragon Ball API returned an error (${response.status}). Please try again later.`);
    }

    let payload;
    try {
      payload = await response.json();
    } catch (error) {
      if (signal?.aborted) {
        throw error;
      }
      if (timedOut) {
        throw new Error("The Dragon Ball API took too long to respond. Please try again.");
      }
      throw new Error("The Dragon Ball API did not return valid JSON.");
    }

    const result = normalizeCharacters(payload);
    return {
      items: result.items,
      totalPages: Number(result.meta?.totalPages) || Math.max(1, Math.ceil(result.items.length / API_CONFIG.pageSize)),
      currentPage: Number(result.meta?.currentPage) || 1,
      serverPaginated: !Array.isArray(payload) && Boolean(result.meta)
    };
  } finally {
    clearTimeout(timeoutId);
    signal?.removeEventListener("abort", abortRequest);
  }
}

export async function fetchCharacters(searchTerm = "", page = 1, signal) {
  const query = searchTerm.trim();
  const parameters = query
    ? { [API_CONFIG.searchParam]: query }
    : {
        [API_CONFIG.pageParam]: page,
        [API_CONFIG.pageSizeParam]: API_CONFIG.pageSize
      };
  return requestCharacters(buildUrl(parameters), signal);
}
