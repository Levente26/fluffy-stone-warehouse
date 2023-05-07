<template>
  <div class="package-card" :class="{ 'package-card--even': index % 2 === 0 }">
    <div class="package-card__info">
      <div>
        <h2>{{ singlePackage.attributes.name }}</h2>
        <div>
          <span>Price</span>
          <span>{{ singlePackage.attributes.price }} €</span>
        </div>
        <div>
          <span>Category</span>
          <span>{{ singlePackage.attributes.category }}</span>
        </div>
      </div>
    </div>
    <div class="package-card__crud">
      <IconEdit />
      <IconDelete />
    </div>
  </div>
</template>

<script setup>
const { singlePackage, index } = defineProps(["singlePackage", "index"]);
</script>

<style scoped lang="scss">
.package-card {
  @apply p-4 rounded-md w-full;
  @apply flex flex-col justify-between;

  @screen md {
    @apply flex-row items-center;
  }

  @screen lg {
    @apply px-10;
  }

  &--even {
    @apply bg-gray-100;
  }
  h2 {
    @apply font-montserratMedium mb-4;
  }

  &__crud {
    @apply flex justify-center items-center mt-6;

    @screen md {
      @apply mt-0;
    }

    & > * {
      @apply mx-4 cursor-pointer;

      &:hover {
        @apply transform scale-105;
        @apply transition-all duration-300;
      }
    }
  }

  &__info {
    div {
      @apply font-montserratLight text-sm mb-2;
      @apply flex flex-col;

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
}
</style>
