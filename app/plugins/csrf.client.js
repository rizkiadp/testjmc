export default defineNuxtPlugin((nuxtApp) => {
  // Automatic CSRF Token Fetcher & Injector for $fetch
  let csrfToken = null;

  const fetchCsrfToken = async () => {
    try {
      const res = await $fetch('/api/auth/csrf');
      if (res && res.csrfToken) {
        csrfToken = res.csrfToken;
      }
    } catch (e) {}
  };

  // Fetch CSRF token immediately on client plugin initialization
  if (import.meta.client) {
    fetchCsrfToken();
  }

  // Intercept all $fetch calls and attach X-CSRF-Token header on mutating HTTP requests
  const globalFetch = globalThis.$fetch;

  if (globalFetch) {
    globalThis.$fetch = new Proxy(globalFetch, {
      apply: async (target, thisArg, argArray) => {
        const [request, opts = {}] = argArray;
        const method = (opts.method || 'GET').toUpperCase();

        if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
          if (!csrfToken) {
            await fetchCsrfToken();
          }
          opts.headers = {
            ...opts.headers,
            'X-CSRF-Token': csrfToken || ''
          };
        }
        return Reflect.apply(target, thisArg, [request, opts]);
      }
    });
  }
});
