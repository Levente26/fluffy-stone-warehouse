<template>
  <section>
    <HeaderLanguageSwitcher />
    <div>
      <button v-if="!user" @click="handleSignup" class="mr-4">Signup</button>
      <button v-if="!user" @click="handleLogin">Login</button>
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

const handleSignup = () => {
  router.push(localePath("/signup", locale.value));
};

const handleLogin = () => {
  router.push(localePath("/login", locale.value));
};
</script>

<style lang="scss" scoped>
section {
  @apply flex justify-between items-center;
  @apply w-[96%] mx-auto h-16 px-4 max-w-screen-2xl;
  @apply mt-4 shadow-lg bg-blue-100 rounded-full shadow-gray-300 z-10;

  @apply sticky top-0;

  & > * {
    @apply mx-2;
  }

  & > div {
    @apply flex items-center;
  }

  button {
    @apply font-montserratMedium;

    &:hover {
      @apply underline;
    }
  }
}
</style>
