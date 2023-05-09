<template>
  <div class="toggle-btn-holder">
    <button @click="$emit('togglePackages', false)">{{ $t("wh-btns.wh-data") }}</button>
    <button @click="$emit('togglePackages', true)">{{ $t("wh-btns.packages") }}</button>
  </div>
</template>

<script setup>
const emit = defineEmits(["togglePackages"]); 
</script>

<style lang="scss" scoped>
.toggle-btn-holder {
  @apply flex justify-center mb-10;

  @screen sm {
    @apply justify-start;
  }

  & > button {
    @apply px-4 py-2 rounded-md border border-font mr-4;
    @apply text-sm font-montserratMedium;
    @apply bg-white text-font;
    @apply transition-all duration-300;

    &:hover {
      @apply bg-font text-white;
    }
  }
}
</style>
