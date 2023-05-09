<template>
  <div class="btn-holder">
    <button @click="createAutomatically"> {{ $t("create.automatically") }}</button>
    <button @click="createManually">{{ $t("create.manually") }}</button>
  </div>
  <form v-if="selectedOption === 2" @submit.prevent="onSubmit">
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
    <div v-if="addressError" class="form-error">{{ $t("create.addressError") }}</div>

    <label>{{ $t("create.max-cap") }}</label>
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="maximumCapacity"
      @focusout="checkMaximumCapacity"
      :class="{ 'form-field-error': maximumCapacityError }"
    />
    <div v-if="maximumCapacityError" class="form-error">{{ $t("create.max-capError") }}</div>

    <label>{{ $t("create.used-cap") }}</label>
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="usedCapacity"
      @focusout="checkUsedCapacity"
      :class="{ 'form-field-error': usedCapacityError }"
    />
    <div v-if="usedCapacityError" class="form-error">{{ $t("create.used-capError") }}</div>

    <label>{{ $t("create.status") }}</label>
    <select
      v-model="status"
      @focusout="checkStatus"
      :class="{ 'form-field-error': statusError }"
    >
      <option value="open" v-if="usedCapacity < maximumCapacity">{{ $t("status.open") }}</option>
      <option value="full" v-if="usedCapacity === maximumCapacity">{{ $t("status.full") }}</option>
      <option value="closed">{{ $t("status.closed") }}</option>
      <option value="empty" v-if="usedCapacity < 1">{{ $t("status.empty") }}</option>
    </select>
    <div v-if="statusError" class="form-error">{{ $t("create.statusError") }}</div>

    <label>{{ $t("create.secondaryWh") }}</label>
    <select
      v-model="secondaryWarehouse"
      @focusout="checkSecondaryWarehouse"
      :class="{ 'form-field-error': secondaryWarehouseError }"
    >
      <option
        v-for="warehouse in warehouses.data"
        :key="warehouse.id"
        :value="warehouse.id"
      >
        {{ warehouse.attributes.name }}
      </option>
    </select>
    <div v-if="secondaryWarehouseError" class="form-error">{{ $t("create.secondaryWhError") }}</div>

    <div v-if="serverError" class="form-error">{{ $t("serverError") }}</div>

    <button
      :disabled="
        nameError ||
        addressError ||
        maximumCapacityError ||
        usedCapacityError ||
        statusError ||
        secondaryWarehouseError
      "
    >
    {{ $t("create.btn") }}
    </button>
  </form>
</template>

<script setup>
const { warehouses } = defineProps(["warehouses"]);
const { create } = useStrapi();
const emit = defineEmits(["closeModal"]);

const selectedOption = ref(null);

const name = ref(null);
const address = ref(null);
const maximumCapacity = ref(null);
const usedCapacity = ref(null);
const status = ref(null);
const secondaryWarehouse = ref(null);

const nameError = ref(false);
const addressError = ref(false);
const maximumCapacityError = ref(false);
const usedCapacityError = ref(false);
const statusError = ref(false);
const secondaryWarehouseError = ref(false);
const serverError = ref(false);

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
  if (maximumCapacity.value === null || maximumCapacity.value === "" || maximumCapacity.value < 1) {
    maximumCapacityError.value = true;
  } else {
    maximumCapacityError.value = false;
  }

  checkUsedCapacity();
};

const checkUsedCapacity = () => {
  if (usedCapacity.value > maximumCapacity.value) {
    usedCapacityError.value = true;
  } else {
    usedCapacityError.value = false;
  }
};

const checkStatus = () => {
  if (status.value === null) {
    statusError.value = true;
  } else {
    statusError.value = false;
  }
};

const checkSecondaryWarehouse = () => {
  if (secondaryWarehouse.value === null) {
    secondaryWarehouseError.value = true;
  } else {
    secondaryWarehouseError.value = false;
  }
};

const createWarehouseObject = () => {
  const obj = {
    name: name.value,
    address: address.value,
    maximumCapacity: maximumCapacity.value,
    usedCapacity: usedCapacity.value,
    packages: [],
    status: "open",
    packagesReceived: usedCapacity.value,
    packagesSent: 0,
    secondaryWarehouse: secondaryWarehouse.value,
  };
  
  clearFormData();
  createNewWarehouse(obj);
};

const clearFormData = () => {
  name.value = null;
  address.value = null;
  maximumCapacity.value = null;
  usedCapacity.value = null;
  status.value = null;
  secondaryWarehouse.value = null;
};

const onSubmit = () => {
  checkName();
  checkAddress();
  checkMaximumCapacity();
  checkUsedCapacity();
  checkStatus();
  checkSecondaryWarehouse();
  if (
    nameError.value ||
    addressError.value ||
    maximumCapacityError.value ||
    usedCapacityError.value ||
    statusError.value ||
    secondaryWarehouseError.value
  ) {
    return;
  }

  createWarehouseObject();
};

const createAutomatically = () => {
  selectedOption.value = 1;

  const obj = {
    name: `Warehouse ${Math.floor(Math.random() * 1000)}`,
    address: "Random street 1",
    maximumCapacity: 100,
    usedCapacity: 0,
    packages: [],
    status: "empty",
    packagesReceived: 0,
    packagesSent: 0,
    secondaryWarehouse: getRandomWarehouse(),
  };

  createNewWarehouse(obj);
};

const createManually = () => {
  selectedOption.value = 2;
};

const getRandomWarehouse = () => {
  const wareHouseIds = warehouses.data.map((warehouse) => warehouse.id);
  const randomWarehouse =
    wareHouseIds[Math.floor(Math.random() * wareHouseIds.length)];
  return randomWarehouse;
};

const createNewWarehouse = async (obj) => {
  try {
    await create("warehouses", obj);
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
.btn-holder {
  @apply flex flex-col items-center;
  @apply w-full mx-auto my-10;

  @screen md {
    @apply w-full;
    @apply flex-row justify-between;
  }

  @screen 2xl {
    @apply w-3/4;
  }

  & > button {
    @apply w-full mx-2 mb-4 py-2 px-4 cursor-pointer;
    @apply border border-font rounded-md;
    @apply transition-all duration-300;

    &:hover {
      @apply bg-font text-white;
    }
  }
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
