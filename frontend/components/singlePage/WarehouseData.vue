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
            {{ data.data.attributes.status }}
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
            {{ data.data.attributes.usedCapacity }}
          </span>
        </div>
      </article>

      <ClientOnly>
        <ChartsPieChart
          :usedCapacity="data.data.attributes.usedCapacity"
          :usedCapacityText="$t('warehouse.usedCapacity')"
          :maximumCapacity="data.data.attributes.maximumCapacity"
          :maximumCapacityText="$t('warehouse.maximumCapacity')"
          :key="data.data.attributes.maximumCapacity - data.data.attributes.usedCapacity"
        />
      </ClientOnly>
    </section>

    <div class="divider"></div>

    <section>
      <article>
        <div>
          <span>{{ $t("wh-data.received-packages") }}</span>
          <span>
            {{ data.data.attributes.packagesReceived }}
          </span>
        </div>

        <div>
          <span>{{ $t("wh-data.sent-packages") }}</span>
          <span>
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
          :key="data.data.attributes.packagesReceived - data.data.attributes.packagesSent"
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

const receivePackage = async (wh) => {
  const randomPackage = Math.ceil(
    Math.random() * (wh.attributes.maximumCapacity - wh.attributes.usedCapacity)
  );

  if (wh.attributes.usedCapacity === wh.attributes.maximumCapacity) {
    try {
      await update("warehouses", wh.id, {
        status: "full",
      });
      emit("refresh");
    } catch (error) {
      console.log(error);
    }
  } else {
    const fetchedProducts = await useFetch(
      `https://fakestoreapi.com/products?limit=${randomPackage}`
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
        await update("warehouses", wh.id, {
          usedCapacity: wh.attributes.usedCapacity + randomPackage,
          packagesReceived: wh.attributes.packagesReceived + randomPackage,
          status:
            wh.attributes.usedCapacity === wh.attributes.maximumCapacity
              ? "full"
              : "open",
        });

        emit("refresh");
      } catch (error) {
        console.log(error);
      }
    });
  }
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
  const randomPackage = Math.ceil(Math.random() * wh.attributes.usedCapacity);

  if (wh.attributes.usedCapacity === 0) {
    try {
      await update("warehouses", wh.id, {
        status: "empty",
      });
      emit("refresh");
    } catch (error) {
      console.log(error);
    }
  } else {
    try {
      await getRandomPackageFromWarehouse(wh, randomPackage);
      await update("warehouses", wh.id, {
        usedCapacity: wh.attributes.usedCapacity - randomPackage,
        packagesSent: wh.attributes.packagesSent + randomPackage,
        status: wh.attributes.usedCapacity > 0 ? "open" : "empty",
      });
      emit("refresh");
    } catch (error) {
      console.log(error);
    }
  }
};

const intervalId = ref(null);
const simulateWarehouseOperations = () => {
  intervalId.value = setInterval(() => {
    // const randomWarehouse = getRandomWarehouse();

    const randomOperation = Math.floor(Math.random() * 2);
    if (randomOperation === 0) {
      receivePackage(data.data);
      console.log(
        "receive",
        "usedCap",
        data.data.attributes.usedCapacity,
        "maxCap",
        data.data.attributes.maximumCapacity,
        "free cap",
        data.data.attributes.maximumCapacity - data.data.attributes.usedCapacity
      );
    } else {
      sendPackage(data.data);
      console.log(
        "send",
        "usedCap",
        data.data.attributes.usedCapacity,
        "maxCap",
        data.data.attributes.maximumCapacity,
        "free cap",
        data.data.attributes.maximumCapacity - data.data.attributes.usedCapacity
      );
    }
  }, 3000);
};

const stopSimulateWarehouseOperations = () => {
  clearInterval(intervalId.value);
};

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
