<template>
  <div @click="goToSingleWarehouse" class="warehouse-card">
    <h2>{{ warehouse.attributes.name }}</h2>
    <p>Current status: {{ warehouse.attributes.status }}</p>
    <div class="divider mb-5"></div>
    <div class="warehouse-card__charts">
      <ClientOnly>
        <ChartsPieChart />
      </ClientOnly>
      <div class="divider"></div>
      <ClientOnly>
        <ChartsXYChart />
      </ClientOnly>
    </div>
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

<style lang="scss" scoped>
.warehouse-card {
  @apply border border-gray-300 p-8 rounded-md cursor-pointer;

  & > h2 {
    @apply text-2xl text-center font-montserratMedium mb-6; 
  }

  & > p {
    @apply text-center text-lg mb-6;

    @screen lg {
      @apply mb-10;
    }
  }

  .divider {
    @apply h-[1px] w-[90%] mx-auto bg-gray-300;
  }

  &__charts {
    @apply grid grid-cols-1 gap-4;

    @screen lg {
      @apply gap-10;
    }
  }
}
</style>
