<template>
  <Header />
  <div>
    <NuxtPage />
  </div>
</template>

<script setup>
const user = useStrapiUser();
const token = useStrapiToken();
const router = useRouter();
const localePath = useLocalePath();
const { locale } = useI18n();

onBeforeMount(() => {
  if (token.value === undefined || token.value === null) {
    router.push(localePath("/login", locale.value));
  }
});
</script>
