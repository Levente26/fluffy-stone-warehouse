<template>
  <div>Warehouse Data</div>
  <div class="warehouse__data">
    <h2>{{ data.data.attributes.name }}</h2>
    <p>{{ data.data.attributes.address }}</p>
    <p>{{ data.data.attributes.status }}</p>
    <p>{{ data.data.attributes.maximumCapacity }}</p>
    <p>{{ data.data.attributes.currentCapacity }}</p>
  </div>
</template>

<script setup>
const data = defineProps(["data"]);

</script>
