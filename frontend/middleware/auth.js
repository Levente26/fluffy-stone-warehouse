export default defineNuxtRouteMiddleware((to, from) => {
  const user = useStrapiUser();
  const token = useStrapiToken();

  if (!user.value || !token.value) {
    return navigateTo("/login");
  }
});
