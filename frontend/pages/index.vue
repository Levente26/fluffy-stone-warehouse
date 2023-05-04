<template>
  <p>{{ $t("welcome") }}</p>
</template>

<script setup>
const { find } = useStrapi();

const { data, pending, refresh, error } = await useAsyncData("warehouse", () =>
  find("warehouses")
);
</script>
