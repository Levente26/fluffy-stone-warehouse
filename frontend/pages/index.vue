<template>
  <p class="text-3xl font-bold underline">{{ $t("welcome") }}</p>
</template>

<script setup>
const { find } = useStrapi();

const { data, pending, refresh, error } = await useAsyncData("warehouse", () =>
  find("warehouses")
);
</script>
