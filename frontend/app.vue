<template>
  <div>
    {{ data }}
  </div>
</template>

<script setup>
const { find } = useStrapi()

const { data, pending, refresh, error } = await useAsyncData(
  "warehouse",
  () => find('warehouses')
);

console.log(data);
</script>
