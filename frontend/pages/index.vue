<template>
  <section class="container" :class="{ 'pointer-events-none': showModal }">
    <h1>Warehouses by Fluffy Stone</h1>

    <div>
      Status Colors: open
      <div class="status status--green"></div>
      closed
      <div class="status status--red"></div>
      full
      <div class="status status--yellow"></div>
      empty
      <div class="status status--blue"></div>
    </div>

    <div>
      Sort by
      <select v-model="sortValue">
        <option value="newest">Newest</option>
        <option value="name">Name</option>
        <option value="freecapacity-asc">Free capacity ASC</option>
        <option value="freecapacity-desc">Free capacity DESC</option>
      </select>

      Filter by status
      <select v-model="filterByStatusValue">
        <option value="all">all</option>
        <option value="open">open</option>
        <option value="full">full</option>
        <option value="closed">closed</option>
        <option value="empty">empty</option>
      </select>
    </div>

    <div v-if="data.data.length === 0">There are no warehouse yet</div>
    <div class="grid-list" v-if="data.data.length > 0">
      <WarehouseCard
        v-for="warehouse in filteredWarehouses"
        :warehouse="warehouse"
        :key="warehouse.id"
      />
    </div>

    <button @click="addNewWarehouse" class="plus-btn">
      <IconPlus />
    </button>
  </section>

  <section class="modal" :class="{ 'modal--active': showModal }">
    <div :class="{ 'modal--hidden-div': showModal }" @click="closeModal"></div>
    <div class="modal__form" :class="{ 'modal__form--active': showModal }">
      <button @click="closeModal">
        <IconClose />
      </button>
      <CreateForm @closeModal="closeModal" :warehouses="data" />
    </div>
  </section>
</template>

<script setup>
const { find } = useStrapi();

const { data, pending, refresh, error } = await useAsyncData("warehouse", () =>
  find("warehouses", {
    populate: "packages.image",
  })
);

const showModal = ref(false);

const addNewWarehouse = () => {
  showModal.value = true;
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = "auto";
  refresh();
};

const sortValue = ref("newest");
const filterByStatusValue = ref("all");

const sortedWarehouses = computed(() => {
  if (sortValue.value === "newest") {
    return data.value.data.sort((a, b) => {
      return (
        new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
      );
    });
  }

  if (sortValue.value === "name") {
    return data.value.data.sort((a, b) => {
      return a.attributes.name.localeCompare(b.attributes.name);
    });
  }

  if (sortValue.value === "freecapacity-asc") {
    return data.value.data.sort((a, b) => {
      return (
        a.attributes.maximumCapacity -
        a.attributes.currentCapacity -
        (b.attributes.maximumCapacity - b.attributes.currentCapacity)
      );
    });
  }

  if (sortValue.value === "freecapacity-desc") {
    return data.value.data.sort((a, b) => {
      return (
        b.attributes.maximumCapacity -
        b.attributes.currentCapacity -
        (a.attributes.maximumCapacity - a.attributes.currentCapacity)
      );
    });
  }
});

const filteredWarehouses = computed(() => {
  if (filterByStatusValue.value === "all") {
    return sortedWarehouses.value;
  }

  if (filterByStatusValue.value === "open") {
    return sortedWarehouses.value.filter(
      (warehouse) => warehouse.attributes.status === "open"
    );
  }

  if (filterByStatusValue.value === "full") {
    return sortedWarehouses.value.filter(
      (warehouse) => warehouse.attributes.status === "full"
    );
  }

  if (filterByStatusValue.value === "closed") {
    return sortedWarehouses.value.filter(
      (warehouse) => warehouse.attributes.status === "closed"
    );
  }

  if (filterByStatusValue.value === "empty") {
    return sortedWarehouses.value.filter(
      (warehouse) => warehouse.attributes.status === "empty"
    );
  }
});
</script>

<style lang="scss" scoped>
.status {
  @apply w-5 h-5 rounded-full;

  &--green {
    background-color: #2ecc71;
  }

  &--yellow {
    background-color: #f1c40f;
  }

  &--red {
    background-color: #e74c3c;
  }

  &--blue {
    background-color: #3498db;
  }
}
.plus-btn {
  @apply mt-10 fixed bottom-6 right-8;
  @apply w-16 h-16;
  @apply shadow-lg bg-blue-100 rounded-full shadow-gray-500;
  @apply flex items-center justify-center;
}
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

  &__form {
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
.container {
  @apply flex flex-col;
  @apply max-w-screen-2xl w-full mx-auto;
  @apply py-10 px-8;

  & > h1 {
    @apply text-2xl font-montserratBold text-center mb-10;

    @screen lg {
      @apply text-4xl text-left;
    }
  }

  .grid-list {
    @apply grid grid-cols-1 gap-4;

    @screen lg {
      @apply grid-cols-2 gap-8;
    }
  }
}
</style>
