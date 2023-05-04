<template>
  <div @click="goToSingleWarehouse">
    <h2>{{ warehouse.attributes.name }}</h2>
    <p>{{ warehouse.attributes.status }}</p>
    <p>{{ warehouse.attributes.maximumCapacity }}</p>
    <p>{{ warehouse.attributes.currentCapacity }}</p>
  </div>
</template>

<script setup>
const { warehouse } = defineProps(["warehouse"]);
const router = useRouter();
const localePath = useLocalePath();
const { locale } = useI18n();

const goToSingleWarehouse = () => {
  router.push(localePath(`/warehouse/${warehouse.id}`, locale.value));
};
</script>
