<template>
  <NuxtLink :to="switchLocalePath('en')">English</NuxtLink>
  <NuxtLink :to="switchLocalePath('hu')">Magyar</NuxtLink> 
</template>

<script setup>
const switchLocalePath = useSwitchLocalePath();
</script>
