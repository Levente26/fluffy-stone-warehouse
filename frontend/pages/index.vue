<template>
  <div ref="componentRef" class="general-style">
    <p class="text-3xl font-bold underline">{{ $t("welcome") }}</p>
  </div>
</template>

<script setup>
import useDetectOutsideClick from "../composables/useDetectClickOutside";
const { find } = useStrapi();

const { data, pending, refresh, error } = await useAsyncData("warehouse", () =>
  find("warehouses")
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
