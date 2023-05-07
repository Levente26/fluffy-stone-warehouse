<template>
  <div class="package-card" :class="{'package-card--even': index % 2 === 0}">
    <h2>{{ singlePackage.attributes.name }}</h2>
    <div>
      <span>Price</span>
      <span>{{ singlePackage.attributes.price }}</span>
    </div>
    <div>
      <span>Category</span>
      <span>{{ singlePackage.attributes.category }}</span>
    </div>
    <div>
      <span>Rating</span>
      <span>{{ singlePackage.attributes.rate }}</span>
    </div>
    <div>
      <span>numberOfRatings</span>
      <span>{{ singlePackage.attributes.countRates }}</span>
    </div>
    <!-- image should go inside here with useStrapiMedia -->
  </div>
</template>

<script setup>
const { singlePackage, index } = defineProps(["singlePackage", "index"]);
</script>

<style scoped lang="scss">
.package-card {
  @apply p-4 rounded-md;
  
  &--even {
    @apply bg-gray-100;
  }
  h2 {
    @apply font-montserratMedium mb-4;
  }

  div {
    @apply font-montserratLight text-sm mb-2;
    @apply flex items-center;

    span {
      &:first-child {
        @apply mr-2;
      }

      &:last-child {
        @apply font-montserrat;
      }
    }
  }
}
</style>
