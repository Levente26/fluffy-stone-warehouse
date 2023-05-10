<template>
  <form @submit.prevent="onSubmit">
    <label>{{ $t("create.name") }}</label>
    <input
      class="mb-4 border-black border"
      type="name"
      v-model="name"
      @focusout="checkName"
      :class="{ 'form-field-error': nameError }"
    />
    <div v-if="nameError" class="form-error">{{ $t("create.nameError") }}</div>

    <label>{{ $t("create.address") }}</label>
    <input
      class="mb-4 border-black border"
      type="text"
      v-model="address"
      @focusout="checkAddress"
      :class="{ 'form-field-error': addressError }"
    />
    <div v-if="addressError" class="form-error">
      {{ $t("create.addressError") }}
    </div>

    <label>{{ $t("create.max-cap") }}</label>
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="maximumCapacity"
      @focusout="checkMaximumCapacity"
      :class="{ 'form-field-error': maximumCapacityError }"
    />
    <div v-if="maximumCapacityError" class="form-error">
      {{ $t("create.max-capError") }}
    </div>

    <label>{{ $t("create.status") }}</label>
    <select
      v-model="status"
      @focusout="checkStatus"
      :class="{ 'form-field-error': statusError }"
    >
      <option value="open" v-if="usedCapacity < maximumCapacity">
        {{ $t("status.open") }}
      </option>
      <option value="full" v-if="usedCapacity === maximumCapacity">
        {{ $t("status.full") }}
      </option>
      <option value="closed">{{ $t("status.closed") }}</option>
      <option value="empty" v-if="usedCapacity < 1">
        {{ $t("status.empty") }}
      </option>
    </select>
    <div v-if="statusError" class="form-error">
      {{ $t("create.statusError") }}
    </div>

    <label>{{ $t("create.secondaryWh") }}</label>
    <select v-model="secondaryWarehouse">
      <template v-for="warehouseItem in data.data" :key="warehouse.id">
        <option
          v-if="warehouse.id !== warehouseItem.id"
          :value="warehouseItem.id"
        >
          {{ warehouseItem.attributes.name }}
        </option>
      </template>
    </select>

    <div v-if="serverError" class="form-error">{{ $t("serverError") }}</div>

    <button
      :disabled="
        nameError || addressError || maximumCapacityError || statusError
      "
    >
      {{ $t("update.updateBtn") }}
    </button>
  </form>
</template>

<script setup>
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();
const i18n = useI18n();
const { update, find } = useStrapi();
const emit = defineEmits(["closeModal"]);
const { warehouse } = defineProps(["warehouse"]);
const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const localePath = useLocalePath();

const name = ref(warehouse.attributes.name);
const address = ref(warehouse.attributes.address);
const maximumCapacity = ref(warehouse.attributes.maximumCapacity);
const usedCapacity = ref(warehouse.attributes.usedCapacity);
const status = ref(warehouse.attributes.status);
const secondaryWarehouse = ref(
  warehouse.attributes.secondaryWarehouse.data !== null
    ? warehouse.attributes.secondaryWarehouse.data.id
    : null
);
const initStatus = ref(warehouse.attributes.status);

const nameError = ref(false);
const addressError = ref(false);
const maximumCapacityError = ref(false);
const statusError = ref(false);
const serverError = ref(false);

const { data, pending, refresh, error } = await useAsyncData(
  "warehousesUpdateWarehouseForm",
  () => find("warehouses")
);

const checkName = () => {
  if (name.value === null || name.value === "") {
    nameError.value = true;
  } else {
    nameError.value = false;
  }
};

const checkAddress = () => {
  if (address.value === null || address.value === "") {
    addressError.value = true;
  } else {
    addressError.value = false;
  }
};

const checkMaximumCapacity = () => {
  if (
    maximumCapacity.value === null ||
    maximumCapacity.value === "" ||
    maximumCapacity.value < 1
  ) {
    maximumCapacityError.value = true;
  } else {
    maximumCapacityError.value = false;
  }
};

const checkStatus = () => {
  if (status.value === null) {
    statusError.value = true;
  } else {
    statusError.value = false;
  }
};

const onSubmit = async () => {
  checkName();
  checkAddress();
  checkMaximumCapacity();
  checkStatus();
  if (
    nameError.value ||
    addressError.value ||
    maximumCapacityError.value ||
    statusError.value
  ) {
    return;
  }

  try {
    if (
      status.value === "closed" &&
      warehouse.attributes.secondaryWarehouse.data !== null
    ) {
      const secondaryWarehouse = warehouse.attributes.secondaryWarehouse.data;

      if (
        secondaryWarehouse.attributes.usedCapacity + usedCapacity.value <=
          secondaryWarehouse.attributes.maximumCapacity &&
        secondaryWarehouse.attributes.status !== "closed"
      ) {
        await update("warehouses", warehouse.id, {
          name: name.value,
          address: address.value,
          maximumCapacity: maximumCapacity.value,
          usedCapacity: 0,
          packages: [],
          packagesSent: warehouse.attributes.packagesSent + usedCapacity.value,
          status: status.value,
          secondaryWarehouse: secondaryWarehouse.value,
        });

        await update("warehouses", secondaryWarehouse.id, {
          usedCapacity:
            secondaryWarehouse.attributes.usedCapacity + usedCapacity.value,
          packagesReceived:
            secondaryWarehouse.attributes.packagesReceived + usedCapacity.value,
          // packages: [
          //   ...secondaryWarehouse.attributes.packages,
          //   ...warehouse.attributes.packages,
          // ],
          status:
            secondaryWarehouse.attributes.usedCapacity + usedCapacity.value ===
            0
              ? "empty"
              : secondaryWarehouse.attributes.usedCapacity +
                  usedCapacity.value ===
                secondaryWarehouse.attributes.maximumCapacity
              ? "full"
              : secondaryWarehouse.attributes.usedCapacity +
                  usedCapacity.value >
                  0 &&
                secondaryWarehouse.attributes.usedCapacity +
                  usedCapacity.value <
                  secondaryWarehouse.attributes.maximumCapacity
              ? "open"
              : "closed",
        });

        router.push(localePath("/", locale.value));
      } else {
        notify({
          text: i18n.t("wh-data.updateNotification"),
          type: "error",
          duration: 1500,
        });
        emit("closeModal");
      }
    } else if (
      status.value === "closed" &&
      warehouse.attributes.secondaryWarehouse.data === null
    ) {
      notify({
        text: i18n.t("wh-data.updateNotification"),
        type: "error",
        duration: 1500,
      });
      emit("closeModal");

      return;
    } else {
      await update("warehouses", warehouse.id, {
        name: name.value,
        address: address.value,
        maximumCapacity: maximumCapacity.value,
        usedCapacity: usedCapacity.value,
        status: status.value,
        secondaryWarehouse: secondaryWarehouse.value,
      });

      if (status.value !== initStatus.value) {
        router.push(localePath("/", locale.value));
      }

      notify({
        text: i18n.t("wh-data.updateNotification"),
        type: "success",
        duration: 1500,
      });
    }
    emit("closeModal");
  } catch (error) {
    console.log(error);
    serverError.value = true;
  }
};
</script>

<style lang="scss" scoped>
h2 {
  @apply text-2xl font-montserratMedium mt-0;
}

form {
  @apply flex flex-col max-w-lg mx-auto w-full;

  & > label {
    @apply text-sm font-montserratLight;
    @apply mb-1;
  }

  & > input,
  select {
    @apply w-full mb-4 py-2 px-4 border border-gray-300 bg-white rounded-md font-montserratLight;
  }

  & > button {
    @apply w-max mx-auto my-4 py-2 px-6 cursor-pointer;
    @apply border border-font bg-font text-white rounded-md;
    @apply transition-all duration-300;

    &:hover {
      @apply bg-white text-font;
    }
  }
}
</style>
