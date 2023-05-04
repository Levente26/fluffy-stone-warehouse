<template>
  <div class="mb-10" ref="componentRef">
    <p class="text-3xl font-bold underline">{{ $t("welcome") }}</p>
  </div>

  <div>
    <h1>Warehouses by Fluffy Stone</h1>
    <div v-if="data.data.length === 0">no worries</div>
    <div v-if="data.data.length > 0">
      <WarehouseCard v-for="warehouse in data.data" :warehouse="warehouse" />
    </div>
  </div>

  <button class="mt-20">Add new warehouse</button>

  <div>
    <!-- this will be the add new warehouse div -->
  </div>
</template>

<script setup>
import useDetectOutsideClick from "../composables/useDetectClickOutside";
const { find } = useStrapi();
const { locale } = useI18n();

const { data, pending, refresh, error } = await useAsyncData(
  "warehouse",
  () =>
    find("warehouses", {
      populate: "products.image",
      locale: locale.value,
    }),
  {
    watch: locale,
  }
);

const componentRef = ref();

useDetectOutsideClick(componentRef, () => {
  console.log("hello");
});
</script>

<style lang="scss" scoped>
div {
  p {
    @apply text-3xl text-blue-500 font-bold underline;
  }
}
</style>
