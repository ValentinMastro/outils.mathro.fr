// Application 100 % côté client (mode SPA) : pas de SSR ni de prérendu,
// une page de repli unique (index.html) boote le routeur pour toutes les routes.
// Les données vivent dans le localStorage du navigateur.
export const ssr = false;
export const prerender = false;
