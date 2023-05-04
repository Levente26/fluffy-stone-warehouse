<template>
  <div>
    <p class="text-3xl font-bold underline">{{ $t("welcome") }}</p>
  </div>
</template>

<script setup>
const { find } = useStrapi();

const { data, pending, refresh, error } = await useAsyncData("warehouse", () =>
  find("warehouses")
);
</script>

<style lang="scss" scoped>
div {
  p {
    @apply text-3xl text-blue-500 font-bold underline;
  }
}
</style>
