<template>
  <div @click="goToSingleWarehouse" class="warehouse-card">
    <h2>{{ warehouse.attributes.name }}</h2>
    <div class="warehouse-card__status" :class="dynamicStatusClass"></div>
    <div class="divider mb-5"></div>
    <div class="warehouse-card__charts">
      <ClientOnly>
        <ChartsPieChart
          :currentCapacity="warehouse.attributes.currentCapacity"
          :maximumCapacity="warehouse.attributes.maximumCapacity"
        />
      </ClientOnly>
      <div class="divider"></div>
      <ClientOnly>
        <ChartsXYChart
          :receivedPackages="warehouse.attributes.packagesReceived"
          :sentPackages="warehouse.attributes.packagesSent"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup>
const { warehouse } = defineProps(["warehouse"]);
const router = useRouter();
const localePath = useLocalePath();
const { locale } = useI18n();

const dynamicStatusClass = computed(() => {
  if (warehouse.attributes.status === "open") {
    return "warehouse-card__status--green";
  }

  if (warehouse.attributes.status === "full") {
    return "warehouse-card__status--yellow";
  }

  if (warehouse.attributes.status === "closed") {
    return "warehouse-card__status--red";
  }

  if (warehouse.attributes.status === "empty") {
    return "warehouse-card__status--blue";
  }
});

const goToSingleWarehouse = () => {
  router.push(localePath(`/warehouse/${warehouse.id}`, locale.value));
};
</script>

<style lang="scss" scoped>
.warehouse-card {
  @apply border border-gray-300 p-8 rounded-md cursor-pointer;

  & > h2 {
    @apply text-2xl text-center font-montserratMedium mb-10;
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

  &__status {
    @apply w-8 h-8 rounded-full relative mx-auto mb-6 border border-gray-50;

    @screen lg {
      @apply mb-10;
    }

    &:before {
      content: "";
      position: relative;
      display: block;
      width: 300%;
      height: 300%;
      box-sizing: border-box;
      margin-left: -100%;
      margin-top: -100%;
      border-radius: 45px;
      animation: pulse-ring 1.25s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
    }

    &:after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 15px;
      box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
      animation: pulse-dot 1.25s cubic-bezier(0.455, 0.03, 0.515, 0.955) -0.4s infinite;
    }

    &--green {
      &:before {
        background-color: #2ecc71;
      }
      &:after {
        background-color: #2ecc71;
      }
    }

    &--yellow {
      &:before {
        background-color: #f1c40f;
      }
      &:after {
        background-color: #f1c40f;
      }
    }

    &--red {
      &:before {
        background-color: #e74c3c;
      }
      &:after {
        background-color: #e74c3c;
      }
    }

    &--blue {
      &:before {
        background-color: #3498db;
      }
      &:after {
        background-color: #3498db;
      }
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(0.33);
      }
      80%,
      100% {
        opacity: 0;
      }
    }

    @keyframes pulse-dot {
      0% {
        transform: scale(0.8);
      }
      50% {
        transform: scale(1);
      }
      100% {
        transform: scale(0.8);
      }
    }
  }
}
</style>
