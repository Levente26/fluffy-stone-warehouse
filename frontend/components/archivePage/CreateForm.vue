<template>
  <div class="btn-holder">
    <button @click="createAutomatically">Create it automatically</button>
    <button @click="createManually">Create it manually</button>
  </div>
  <form v-if="selectedOption === 2" @submit.prevent="onSubmit">
    <label>Name</label>
    <input
      class="mb-4 border-black border"
      type="name"
      v-model="name"
      @focusout="checkName"
      :class="{ 'form-field-error': nameError }"
    />
    <div v-if="nameError" class="form-error">error happened</div>

    <label>Address</label>
    <input
      class="mb-4 border-black border"
      type="text"
      v-model="address"
      @focusout="checkAddress"
      :class="{ 'form-field-error': addressError }"
    />
    <div v-if="addressError" class="form-error">error happened</div>

    <label>Maximum Capacity</label>
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="maximumCapacity"
      @focusout="checkMaximumCapacity"
      :class="{ 'form-field-error': maximumCapacityError }"
    />
    <div v-if="maximumCapacityError" class="form-error">error happened</div>

    <label>Used Capacity</label>
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="usedCapacity"
      @focusout="checkUsedCapacity"
      :class="{ 'form-field-error': usedCapacityError }"
    />
    <div v-if="usedCapacityError" class="form-error">error happened</div>

    <label>Status</label>
    <select
      v-model="status"
      @focusout="checkStatus"
      :class="{ 'form-field-error': statusError }"
    >
      <option value="open">open</option>
      <option value="full">full</option>
      <option value="closed">closed</option>
      <option value="empty">empty</option>
    </select>
    <div v-if="statusError" class="form-error">error happened</div>

    <label>Received Packages</label>
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="packagesReceived"
      @focusout="checkPackagesReceived"
      :class="{ 'form-field-error': packagesReceivedError }"
    />
    <div v-if="packagesReceivedError" class="form-error">error happened</div>

    <label>Packages Sent</label>
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="packagesSent"
      @focusout="checkPackagesSent"
      :class="{ 'form-field-error': packagesSentError }"
    />
    <div v-if="packagesSentError" class="form-error">error happened</div>

    <label>Secondary Warehouse</label>
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
    <div v-if="secondaryWarehouseError" class="form-error">error happened</div>

    <div v-if="serverError" class="form-error">server error happened</div>

    <button
      :disabled="
        nameError ||
        addressError ||
        maximumCapacityError ||
        usedCapacityError ||
        statusError ||
        packagesReceivedError ||
        packagesSentError ||
        secondaryWarehouseError
      "
    >
      submit
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
const packagesReceived = ref(null);
const packagesSent = ref(null);
const secondaryWarehouse = ref(null);

const nameError = ref(false);
const addressError = ref(false);
const maximumCapacityError = ref(false);
const usedCapacityError = ref(false);
const statusError = ref(false);
const packagesReceivedError = ref(false);
const packagesSentError = ref(false);
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
  if (maximumCapacity.value === null || maximumCapacity.value === "") {
    maximumCapacityError.value = true;
  } else {
    maximumCapacityError.value = false;
  }
};

const checkUsedCapacity = () => {
  if (usedCapacity.value === null || usedCapacity.value === "") {
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

const checkPackagesReceived = () => {
  if (packagesReceived.value === null || packagesReceived.value === "") {
    packagesReceivedError.value = true;
  } else {
    packagesReceivedError.value = false;
  }
};

const checkPackagesSent = () => {
  if (packagesSent.value === null || packagesSent.value === "") {
    packagesSentError.value = true;
  } else {
    packagesSentError.value = false;
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
    // if usedCapacity not null add products to obj
    usedCapacity: usedCapacity.value,
    packages: [],
    status: "open",
    packagesReceived: packagesReceived.value,
    packagesSent: packagesSent.value,
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
  packagesReceived.value = null;
  packagesSent.value = null;
  secondaryWarehouse.value = null;
};

const onSubmit = () => {
  checkName();
  checkAddress();
  checkMaximumCapacity();
  checkUsedCapacity();
  checkStatus();
  checkPackagesReceived();
  checkPackagesSent();
  checkSecondaryWarehouse();
  if (
    nameError.value ||
    addressError.value ||
    maximumCapacityError.value ||
    usedCapacityError.value ||
    statusError.value ||
    packagesReceivedError.value ||
    packagesSentError.value ||
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
