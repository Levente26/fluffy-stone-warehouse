<template>
  <div>
    <h2>{{ warehouse.attributes.name }}</h2>
    <!-- <p>{{ warehouse.attributes.address }}</p> -->
    <p>{{ warehouse.attributes.status }}</p>
    <p>{{ warehouse.attributes.maximumCapacity }}</p>
    <p>{{ warehouse.attributes.currentCapacity }}</p>

    <!-- <div v-if="warehouse.attributes.products.data.length === 0">no products</div>
    <div v-if="warehouse.attributes.products.data.length > 0">
      <ProductCard
        v-for="product in warehouse.attributes.products.data"
        :product="product"
      />
    </div> -->
  </div>
</template>

<script setup>
const { warehouse } = defineProps(["warehouse"]);
</script>
