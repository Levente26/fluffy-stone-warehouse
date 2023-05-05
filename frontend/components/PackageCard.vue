<template>
  <div>
    <h2>{{ singlePackage.attributes.name }}</h2>
    <p>{{ singlePackage.attributes.price }}</p>
    <p>{{ singlePackage.attributes.quantity }}</p>
    <p>{{ singlePackage.attributes.category }}</p>
    <p>{{ singlePackage.attributes.rating }}</p>
    <p>{{ singlePackage.attributes.numberOfRatings }}</p>
    <!-- image should go inside here with useStrapiMedia -->
  </div>
</template>

<script setup>
const { singlePackage } = defineProps(["singlePackage"]);
</script>
