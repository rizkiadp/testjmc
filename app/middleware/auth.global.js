export default defineNuxtRouteMiddleware(async (to, from) => {
  // Server-side token check
  if (import.meta.server) {
    const token = useCookie('token');

    // If visiting /login while logged in -> redirect to home
    if (to.path === '/login' && token.value) {
      return navigateTo('/');
    }

    // If visiting protected route without token -> redirect to /login
    if (to.path !== '/login' && !to.path.startsWith('/api') && !token.value) {
      return navigateTo('/login');
    }
  }

  // Client-side session check & RememberMe state sync with server
  if (import.meta.client) {
    if (to.path !== '/login' && !to.path.startsWith('/api')) {
      try {
        const res = await $fetch('/api/auth/me');
        if (res.success && res.user) {
          localStorage.setItem('user', JSON.stringify(res.user));
        } else {
          localStorage.removeItem('user');
          return navigateTo('/login');
        }
      } catch (e) {
        localStorage.removeItem('user');
        return navigateTo('/login');
      }
    }

    const user = localStorage.getItem('user');

    // If visiting /login while logged in -> redirect to home
    if (to.path === '/login' && user) {
      return navigateTo('/');
    }
  }
});
