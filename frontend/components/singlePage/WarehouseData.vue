<template>
  <h2>{{ $t("wh-data.title") }}</h2>
  <div class="warehouse__data">
    <section>
      <article>
        <div>
          <span> {{ $t("wh-data.address") }} </span>
          <span>
            {{ data.data.attributes.address }}
          </span>
        </div>
        <div>
          <span> {{ $t("wh-data.status") }} </span>
          <span :key="data.data.attributes.status">
            <!-- {{ data.data.attributes.status }} -->
            <div class="warehouse__status" :class="dynamicStatusClass"></div>
          </span>
        </div>
      </article>

      <button @click="simulateWarehouseOperations">Simulate</button>
      <button class="ml-4" @click="stopSimulateWarehouseOperations">
        Stop Simulate
      </button>
    </section>

    <div class="divider"></div>

    <section>
      <article>
        <div>
          <span> {{ $t("wh-data.max-cap") }} </span>
          <span>
            {{ data.data.attributes.maximumCapacity }}
          </span>
        </div>
        <div>
          <span> {{ $t("wh-data.used-cap") }} </span>
          <span>
            {{ usedCapacityRef }}
          </span>
        </div>
      </article>

      <ClientOnly>
        <ChartsPieChart
          :usedCapacity="usedCapacityRef"
          :usedCapacityText="$t('warehouse.usedCapacity')"
          :maximumCapacity="data.data.attributes.maximumCapacity"
          :maximumCapacityText="$t('warehouse.maximumCapacity')"
          :key="usedCapacityRef"
        />
      </ClientOnly>
    </section>

    <div class="divider"></div>

    <section>
      <article>
        <div>
          <span>{{ $t("wh-data.received-packages") }}</span>
          <span :key="data.data.attributes.packagesReceived">
            {{ data.data.attributes.packagesReceived }}
          </span>
        </div>

        <div>
          <span>{{ $t("wh-data.sent-packages") }}</span>
          <span :key="data.data.attributes.packagesSent">
            {{ data.data.attributes.packagesSent }}
          </span>
        </div>
      </article>

      <ClientOnly>
        <ChartsXYChart
          :receivedPackages="data.data.attributes.packagesReceived"
          :receivedPackagesText="$t('warehouse.receivedPackages')"
          :sentPackages="data.data.attributes.packagesSent"
          :sentPackagesText="$t('warehouse.sentPackages')"
          :key="
            data.data.attributes.packagesReceived +
            data.data.attributes.packagesSent
          "
        />
      </ClientOnly>
    </section>
  </div>
</template>

<script setup>
const data = defineProps(["data"]);
const router = useRouter();
const route = useRoute();
const { create, delete: _delete, update } = useStrapi();
const emit = defineEmits(["refresh"]);
const usedCapacityRef = ref(data.data.attributes.usedCapacity);
const packagesReceivedRef = ref(data.data.attributes.packagesReceived);
const packagesSentRef = ref(data.data.attributes.packagesSent);

const receivePackage = async (wh) => {
  const freeCapacity = wh.attributes.maximumCapacity - usedCapacityRef.value;

  const randomPackagesCount =
    freeCapacity <= wh.attributes.maximumCapacity
      ? Math.floor(Math.random() * (freeCapacity - 1) + 1)
      : 0;

  usedCapacityRef.value += randomPackagesCount;
  packagesReceivedRef.value += randomPackagesCount;

  const fetchedProducts = await useFetch(
    `https://fakestoreapi.com/products?limit=${randomPackagesCount.value}`
  );

  fetchedProducts.data.value.map(async (product) => {
    const obj = {
      name: product.title,
      price: product.price,
      category: product.category,
      warehouse: wh.id,
    };

    try {
      await create("packages", obj);
    } catch (error) {
      console.log(error);
    }
  });
};

const getRandomPackageFromWarehouse = async (wh, numberOfPackages) => {
  Array(numberOfPackages).map(async () => {
    const packages = wh.attributes.packages.data;
    const randomPackageId =
      packages[Math.floor(Math.random() * packages.length)].id;

    try {
      await _delete("packages", randomPackageId);
    } catch (error) {
      console.log(error);
    }
  });
};

const sendPackage = async (wh) => {
  const randomPackagesCount =
    usedCapacityRef.value > 0
      ? Math.floor(Math.random() * (usedCapacityRef.value - 1) + 1)
      : 0;

  usedCapacityRef.value -= randomPackagesCount;
  packagesSentRef.value += randomPackagesCount;

  try {
    await getRandomPackageFromWarehouse(wh, randomPackagesCount);
  } catch (error) {
    console.log(error);
  }
};

const intervalId = ref(null);

const simulateWarehouseOperations = () => {
  intervalId.value = setInterval(async () => {
    const randomOperation = Math.floor(Math.random() * 2);

    if (randomOperation === 0) {
      receivePackage(data.data);
    } else {
      sendPackage(data.data);
    }

    try {
      await update("warehouses", data.data.id, {
        usedCapacity: usedCapacityRef.value,
        packagesReceived: packagesReceivedRef.value,
        packagesSent: packagesSentRef.value,
        status:
          usedCapacityRef.value === 0
            ? "empty"
            : usedCapacityRef.value === data.data.attributes.maximumCapacity
            ? "full"
            : usedCapacityRef.value > 0 &&
              usedCapacityRef.value < data.data.attributes.maximumCapacity
            ? "open"
            : "closed",
      });
    } catch (error) {
      console.log(error);
    }

    emit("refresh");
  }, 3000);
};

const stopSimulateWarehouseOperations = () => {
  clearInterval(intervalId.value);
};

const dynamicStatusClass = computed(() => {
  switch (data.data.attributes.status) {
    case "open":
      return "warehouse__status--green";

    case "full":
      return "warehouse__status--yellow";

    case "closed":
      return "warehouse__status--red";

    case "empty":
      return "warehouse__status--blue";
  }
});

onBeforeUnmount(() => {
  stopSimulateWarehouseOperations();
});

onMounted(() => {
  router.push({
    path: route.path,
    query: { warehouse: data.data.attributes.name },
  });
});
</script>

<style lang="scss" scoped>
h2 {
  @apply text-2xl font-montserratMedium mb-10;
}

.divider {
  @apply h-[1px] w-full mx-auto bg-gray-300 my-10;
}

.warehouse {
  &__status {
    @apply w-8 h-8 rounded-full relative mt-6 ml-5 border border-gray-50;

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

  &__data {
    @apply flex flex-col;

    & section {
      @apply flex flex-col mb-10;

      @screen lg {
        @apply flex-row;

        & > * {
          @apply w-1/2;
        }
      }

      & article {
        @apply flex flex-col gap-4;

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
    }
  }

  &__charts {
    @apply flex flex-col gap-4;
  }
}
</style>
