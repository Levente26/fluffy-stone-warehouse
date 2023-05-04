<template>
  <div>
    <h2>{{ product.attributes.name }}</h2>
    <p>{{ product.attributes.price }}</p>
    <p>{{ product.attributes.quantity }}</p>
    <p>{{ product.attributes.category }}</p>
    <p>{{ product.attributes.rating }}</p>
    <p>{{ product.attributes.numberOfRatings }}</p>
    <!-- image should go inside here with useStrapiMedia -->
  </div>
</template>

<script setup>
const { product } = defineProps(["product"]);
</script>
