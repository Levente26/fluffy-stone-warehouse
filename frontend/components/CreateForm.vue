<template>
  <div class="btn-holder">
    <button @click="createAutomatically">Create it automatically</button>
    <button @click="createManually">Create it manually</button>
  </div>
  <form
    v-if="selectedOption === 2"
    @submit.prevent="onSubmit"
    class="flex flex-col"
  >
    name
    <input
      class="mb-4 border-black border"
      type="name"
      v-model="name"
      @focusout="checkName"
    />
    <div v-if="nameError">error happened</div>

    address
    <input
      class="mb-4 border-black border"
      type="text"
      v-model="address"
      @focusout="checkAddress"
    />
    <div v-if="addressError">error happened</div>

    maximum capacity
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="maximumCapacity"
      @focusout="checkMaximumCapacity"
    />
    <div v-if="maximumCapacityError">error happened</div>

    current capacity
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="currentCapacity"
      @focusout="checkCurrentCapacity"
    />
    <div v-if="currentCapacityError">error happened</div>

    packages
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="packages"
      @focusout="checkPackages"
    />
    <div v-if="packagesError">error happened</div>

    status
    <select v-model="status" @focusout="checkStatus">
      <option value="a">aaa</option>
      <!-- <option v-for="status in statuses" :key="status.id">
        {{ status.name }}
      </option> -->
    </select>
    <div v-if="statusError">error happened</div>

    packages received
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="packagesReceived"
      @focusout="checkPackagesReceived"
    />
    <div v-if="packagesReceivedError">error happened</div>

    packages sent
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="packagesSent"
      @focusout="checkPackagesSent"
    />
    <div v-if="packagesSentError">error happened</div>

    secondary warehouse
    <select v-model="secondaryWarehouse" @focusout="checkSecondaryWarehouse">
      <option value="a">aaa</option>
      <!-- <option v-for="warehouse in warehouses" :key="warehouse.id">
        {{ warehouse.name }}
      </option> -->
    </select>
    <div v-if="secondaryWarehouseError">error happened</div>

    <div v-if="serverError">server error happened</div>

    <button
      :disabled="
        nameError ||
        addressError ||
        maximumCapacityError ||
        currentCapacityError ||
        packagesError ||
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
const selectedOption = ref(null);

const name = ref(null);
const address = ref(null);
const maximumCapacity = ref(null);
const currentCapacity = ref(null);
const packages = ref(null);
const status = ref(null);
const packagesReceived = ref(null);
const packagesSent = ref(null);
const secondaryWarehouse = ref(null);

const nameError = ref(false);
const addressError = ref(false);
const maximumCapacityError = ref(false);
const currentCapacityError = ref(false);
const packagesError = ref(false);
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

const checkCurrentCapacity = () => {
  if (currentCapacity.value === null || currentCapacity.value === "") {
    currentCapacityError.value = true;
  } else {
    currentCapacityError.value = false;
  }
};

const checkPackages = () => {
  if (packages.value === null || packages.value === "") {
    packagesError.value = true;
  } else {
    packagesError.value = false;
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
    currentCapacity: currentCapacity.value,
    packages: packages.value,
    status: status.value,
    packagesReceived: packagesReceived.value,
    packagesSent: packagesSent.value,
    secondaryWarehouse: secondaryWarehouse.value,
  };
  createNewWarehouse();
};

const onSubmit = () => {
  checkName();
  checkAddress();
  checkMaximumCapacity();
  checkCurrentCapacity();
  checkPackages();
  checkStatus();
  checkPackagesReceived();
  checkPackagesSent();
  checkSecondaryWarehouse();
  if (
    nameError.value ||
    addressError.value ||
    maximumCapacityError.value ||
    currentCapacityError.value ||
    packagesError.value ||
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
  createNewWarehouse();
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

const createNewWarehouse = () => {
  if (selectedOption.value === 1) {
    // create automatically
    const obj = {
      name: "Warehouse 1",
      address: "Address 1",
      maximumCapacity: 100,
      currentCapacity: 0,
      packages: [],
      status: "open",
      packagesReceived: 0,
      packagesSent: 0,
      secondaryWarehouse: getRandomWarehouse(),
    };
  } else if (selectedOption.value === 2) {
    // create manually
  }
};
</script>

<style lang="scss" scoped>
.btn-holder {
  @apply flex justify-between items-center w-full mx-auto mt-10;

  @screen md {
    @apply w-1/2;
  }
}
</style>
