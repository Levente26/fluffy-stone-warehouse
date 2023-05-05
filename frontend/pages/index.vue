<template>
  <div class="container">
    <h1>Warehouses by Fluffy Stone</h1>
    <div v-if="data.data.length === 0">There are no warehouse yet</div>
    <div class="grid-list" v-if="data.data.length > 0">
      <WarehouseCard v-for="warehouse in data.data" :warehouse="warehouse" />
    </div>
    
    <button class="mt-10 fixed bottom-4 right-4">Add new warehouse</button>
    
    <div></div>
  </div>
</template>

<script setup>
import useDetectOutsideClick from "../composables/useDetectClickOutside";
const { find } = useStrapi();

const { data, pending, refresh, error } = await useAsyncData("warehouse", () =>
  find("warehouses", {
    populate: "products.image",
  })
);

const componentRef = ref();

useDetectOutsideClick(componentRef, () => {
  console.log("hello");
});
</script>

<style lang="scss" scoped>
.container {
  @apply flex flex-col;
  @apply max-w-screen-2xl w-full mx-auto;
  @apply py-10 px-8;

  & > h1 {
    @apply text-2xl font-montserratBold text-center mb-10;

    @screen lg {
      @apply text-4xl text-left; 
    }
  }

  .grid-list {
    @apply grid grid-cols-1 gap-4;

    @screen lg {
      @apply grid-cols-2 gap-8;
    }
  }
}
</style>
