<template>
  <h2>Warehouse Data</h2>
  <div class="warehouse__data">
    <div>
      <span> Address: </span>
      <span>
        {{ data.data.attributes.address }}
      </span>
    </div>
    <div>
      <span> Current Status </span>
      <span>
        {{ data.data.attributes.status }}
      </span>
    </div>
    <div>
      <span> Maximum Capacity </span>
      <span>
        {{ data.data.attributes.maximumCapacity }}
      </span>
    </div>
    <div>
      <span> Current Capacity </span>
      <span>
        {{ data.data.attributes.currentCapacity }}
      </span>
    </div>
  </div>

  <div class="divider"></div>

  <div class="warehouse__charts">
    <ClientOnly>
      <ChartsPieChart
        :currentCapacity="data.data.attributes.currentCapacity"
        :maximumCapacity="data.data.attributes.maximumCapacity"
      />
    </ClientOnly>
    <div class="divider"></div>
    <ClientOnly>
      <ChartsXYChart
        :receivedPackages="data.data.attributes.packagesReceived"
        :sentPackages="data.data.attributes.packagesSent"
      />
    </ClientOnly>
  </div>
</template>

<script setup>
const data = defineProps(["data"]);
</script>

<style lang="scss" scoped>
h2 {
  @apply text-2xl font-montserratMedium mb-10;
}

.divider {
  @apply h-[1px] w-[90%] mx-auto bg-gray-300 my-10;
}

.warehouse {
  &__data {
    @apply flex flex-col;
    & > div {
      @apply flex flex-col mb-4;

      &:last-child {
        @apply mb-0;
      }

      & > span {
        &:first-child {
          @apply font-montserratMedium mb-1;
        }

        &:last-child {
          @apply font-montserratLight;
        }
      }
    }
  }

  &__charts {
    @apply flex flex-col gap-4;
  }
}
</style>
