<template>
  <div>
    <NuxtLink :class="{'inactive-lang': locale !== 'en'}" :to="switchLocalePath('en')">EN</NuxtLink>
    |
    <NuxtLink :class="{'inactive-lang': locale !== 'hu'}" :to="switchLocalePath('hu')">HU</NuxtLink> 
  </div>
</template>

<script setup>
const switchLocalePath = useSwitchLocalePath();
const { locale } = useI18n();
</script>

<style lang="scss" scoped>
div {
  @apply flex justify-between items-center;

  & > * {
    @apply mx-2;
  }

  & > a {
    @apply font-montserratMedium;

    &:hover {
      @apply underline;
    }
  }

  .inactive-lang {
    @apply font-montserratLight;
  }
}
</style>
