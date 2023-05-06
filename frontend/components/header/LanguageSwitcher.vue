<template>
  <div>
    <NuxtLink :to="switchLocalePath('en')">EN</NuxtLink>
    |
    <NuxtLink :to="switchLocalePath('hu')">HU</NuxtLink> 
  </div>
</template>

<script setup>
const switchLocalePath = useSwitchLocalePath();
</script>

<style lang="scss" scoped>
div {
  @apply flex justify-between items-center;

  & > * {
    @apply mx-2;
  }
}
</style>
