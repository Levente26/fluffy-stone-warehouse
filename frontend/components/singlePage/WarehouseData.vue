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
          <span>
            <div class="warehouse__status" :class="dynamicStatusClass"></div>
          </span>
        </div>
      </article>

      <button v-if="!isSimulating" @click="updateWarehouseData">{{ $t("wh-data.updateFormTitle") }}</button>

      <button v-if="!isSimulating && data.data.attributes.status !== 'closed'" @click="simulateWarehouseOperations">
        {{ $t("simulate.start") }}
      </button>
      <button
        v-if="isSimulating"
        class="ml-4"
        @click="stopSimulateWarehouseOperations"
      >
        {{ $t("simulate.stop") }}
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
          <span>
            {{ packagesReceivedRef }}
          </span>
        </div>

        <div>
          <span>{{ $t("wh-data.sent-packages") }}</span>
          <span>
            {{ packagesSentRef }}
          </span>
        </div>
      </article>

      <ClientOnly>
        <ChartsXYChart
          :receivedPackages="packagesReceivedRef"
          :receivedPackagesText="$t('warehouse.receivedPackages')"
          :sentPackages="packagesSentRef"
          :sentPackagesText="$t('warehouse.sentPackages')"
          :key="usedCapacityRef"
        />
      </ClientOnly>
    </section>
  </div>

  <section class="modal" :class="{ 'modal--active': showModal }">
    <div :class="{ 'modal--hidden-div': showModal }" @click="closeModal"></div>
    <div class="modal__form" :class="{ 'modal__form--active': showModal }">
      <div class="modal__top">
        <h2>{{ $t("wh-data.updateFormTitle") }}</h2>

        <button @click="closeModal">
          <IconClose />
        </button>
      </div>

      <SinglePageUpdateWarehouseForm @closeModal="closeModal" :key="data.data" :warehouse="data.data" />
    </div>
  </section>

  <notifications position="bottom right" />
</template>

<script setup>
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();
const data = defineProps(["data"]);
const router = useRouter();
const route = useRoute();
const { create, delete: _delete, update } = useStrapi();
const emit = defineEmits(["refresh"]);
const i18n = useI18n();
const usedCapacityRef = ref(data.data.attributes.usedCapacity);
const packagesReceivedRef = ref(data.data.attributes.packagesReceived);
const packagesSentRef = ref(data.data.attributes.packagesSent);
const statusRef = ref(data.data.attributes.status);
const isSimulating = ref(false);

const updateWarehouseData = () => {
  showModal.value = true;
  document.body.style.overflow = "hidden";
};

const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = "auto";
  emit("refresh");
};

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

  if (randomPackagesCount > 0) {
    notify({
      text:
        randomPackagesCount +
        " " +
        i18n.t("wh-data.packageReceivedNotification"),
      type: "success",
      duration: 1500,
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

  if (randomPackagesCount > 0) {
    notify({
      text:
        randomPackagesCount + " " + i18n.t("wh-data.packageSentNotification"),
      type: "success",
      duration: 1500,
    });
  }
};

const updateStatus = () => {
  if (usedCapacityRef.value === 0) {
    statusRef.value = "empty";
  } else if (usedCapacityRef.value === data.data.attributes.maximumCapacity) {
    statusRef.value = "full";
  } else if (
    usedCapacityRef.value > 0 &&
    usedCapacityRef.value < data.data.attributes.maximumCapacity
  ) {
    statusRef.value = "open";
  }
};

const intervalId = ref(null);

const simulateWarehouseOperations = () => {
  isSimulating.value = true;

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

    updateStatus();

    emit("refresh");
  }, 1000);
};

const stopSimulateWarehouseOperations = () => {
  emit("refresh");
  isSimulating.value = false;
  clearInterval(intervalId.value);
};

const dynamicStatusClass = computed(() => {
  switch (statusRef.value) {
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
.modal {
  @apply bg-gray-800 bg-opacity-70;
  @apply opacity-0 pointer-events-none transition-all duration-300;
  @apply flex justify-end;
  @apply fixed top-0 left-0 w-full h-full z-40;

  &--active {
    @apply translate-x-0 opacity-100 pointer-events-auto;
  }

  &--hidden-div {
    @apply opacity-0 w-[20%];

    @screen lg {
      @apply w-[50%];
    }

    @screen xl {
      @apply w-[55%];
    }
  }

  &__top {
    @apply flex items-center justify-between;
    @apply mb-8;

    h2 {
      @apply text-2xl font-montserratMedium;
    }
  }

  &__form {
    @apply overflow-y-auto;
    @apply bg-white;
    @apply w-[80%] h-full p-8;
    @apply flex flex-col;

    button {
      @apply ml-auto;
    }

    @screen lg {
      @apply w-[50%];
    }

    @screen xl {
      @apply w-[45%];
    }

    &--active {
      animation: slideIn 0.4s ease-in-out forwards;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
      }
      to {
        transform: translateX(0);
      }
    }
  }
}

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

      & button {
        @apply w-max h-max rounded-md bg-font text-white font-montserratMedium;
        @apply flex items-center justify-center self-center;
        @apply px-4 py-4 mt-14;
        @apply border border-font;
        @apply transition-all duration-300 ease-in-out;

        &:hover {
          @apply bg-white text-font;
        }

        @screen lg {
          @apply ml-auto mt-0 mr-20;
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
