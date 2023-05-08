<template>
  <section class="container">
    <h1>{{ data.data.attributes.name }}</h1>

    <SinglePageToggleButtons @togglePackages="togglePackages" />

    <div v-if="!showPackages">
      <SinglePageWarehouseData :data="data.data" />
    </div>

    <div v-if="showPackages">
      <SinglePagePackageList @refresh="refresh" :warehouse="data.data" :packages="data.data.attributes.packages.data" :key="data" />
    </div>
  </section>
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

const showPackages = ref(false);

const togglePackages = (val) => {
  showPackages.value = val;
};
</script>

<style scoped lang="scss">

.container {
  @apply flex flex-col;
  @apply max-w-screen-2xl w-full mx-auto;
  @apply py-10 px-8;

  & > h1 {
    @apply text-2xl font-montserratBold text-center mb-10;

    @screen sm {
      @apply text-4xl text-left;
    }
  }
}
</style>
