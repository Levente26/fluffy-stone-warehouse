<template>
  <h1>Warehouse {{ data.data.attributes.name }} by Fluffy Stone</h1>
  <h2>{{ data.data.attributes.name }}</h2>
  <p>{{ data.data.attributes.address }}</p>
  <p>{{ data.data.attributes.status }}</p>
  <p>{{ data.data.attributes.maximumCapacity }}</p>
  <p>{{ data.data.attributes.currentCapacity }}</p>

  <div v-if="data.data.attributes.packages.data.length === 0">no packages</div>
  <div v-if="data.data.attributes.packages.data.length > 0">
    <PackageCard
      v-for="singlePackage in data.data.attributes.packages.data"
      :singlePackage="singlePackage"
    />
  </div>
</template>

<script setup>
const { findOne } = useStrapi();
const route = useRoute();

const { data, pending, refresh, error } = await useAsyncData(
  "singleWarehouse",
  () =>
    findOne("warehouses", route.params.id, {
      populate: ["packages.image"],
    })
);
</script>
