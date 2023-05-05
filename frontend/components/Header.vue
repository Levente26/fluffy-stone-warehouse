<template>
  <section>
    <LanguageSwitcher />
    <div>
      <button v-if="!user">Signup</button>
      <button v-if="!user">Login</button>
      <button v-if="user" @click="handleLogout">Logout</button>
    </div>

  </section>
</template>

<script setup>
const { logout } = useStrapiAuth();
const router = useRouter();
const localePath = useLocalePath();
const { locale } = useI18n();
const user = useStrapiUser();

const handleLogout = () => {
  logout();
  router.push(localePath("/login", locale.value));
};
</script>

<style lang="scss" scoped>
section {
  @apply flex justify-between items-center;
  @apply w-full h-16 px-4;
  @apply bg-orange-200;
  @apply sticky top-0;

  & > * {
    @apply mx-2;
  }
}
</style>
