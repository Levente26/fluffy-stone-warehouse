<template>
  <Header />
  <main>
    <NuxtPage />
  </main>
</template>

<script setup>

// const user = useStrapiUser();
// const token = useStrapiToken();
// const router = useRouter();
// const localePath = useLocalePath();
// const { locale } = useI18n();

// onBeforeMount(() => {
// if (
//   token.value === undefined ||
//   token.value === null ||
//   user.value === null ||
//   user.value === undefined
// ) {
//   navigateTo(localePath("/login", locale.value));
// }
// });
</script>

<style lang="scss" scoped>
main {
  @apply flex flex-col max-w-screen-2xl mx-auto;
}
</style>
