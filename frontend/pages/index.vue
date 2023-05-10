<template>
  <section class="container" :class="{ 'pointer-events-none': showModal }">
    <h1>{{ $t("archive.title") }}</h1>

    <ArchivePageStatusColorHelper />

    <div class="filter-wrapper">
      <div class="select-wrapper">
        <span>{{ $t("archive.sortby") }}</span>

        <select v-model="sortValue">
          <option value="newest">{{ $t("archive.sortbyVal.newest") }}</option>
          <option value="oldest">{{ $t("archive.sortbyVal.oldest") }}</option>
          <option value="name">{{ $t("archive.sortbyVal.name") }}</option>
          <option value="freecapacity-asc">
            {{ $t("archive.sortbyVal.free-cap-asc") }}
          </option>
          <option value="freecapacity-desc">
            {{ $t("archive.sortbyVal.free-cap-desc") }}
          </option>
        </select>
      </div>

      <div class="select-wrapper">
        <span>{{ $t("archive.filterby") }}</span>

        <select v-model="filterByStatusValue">
          <option value="all">{{ $t("archive.filterbyVal.all") }}</option>
          <option value="open">{{ $t("archive.filterbyVal.open") }}</option>
          <option value="full">{{ $t("archive.filterbyVal.full") }}</option>
          <option value="closed">{{ $t("archive.filterbyVal.closed") }}</option>
          <option value="empty">{{ $t("archive.filterbyVal.empty") }}</option>
        </select>
      </div>
    </div>

    <div v-if="data.data.length === 0" class="mt-10 text-2xl lg:text-3xl max-w-xl mx-auto font-montserratBold text-center">{{ $t("archive.no-wh") }}</div>
    <div class="grid-list" v-if="data.data.length > 0">
      <ArchivePageWarehouseCard
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
      <div class="modal__top">
        <h2>{{ $t("archive.create-wh") }}</h2>

        <button @click="closeModal">
          <IconClose />
        </button>
      </div>

      <ArchivePageCreateForm @closeModal="closeModal" :warehouses="data" />
    </div>
  </section>

  <notifications position="bottom right" />
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});

const { find } = useStrapi();
const router = useRouter();
const route = useRoute();

const { data, pending, refresh, error } = await useAsyncData("warehouse", () =>
  find("warehouses", {
    populate: ["packages"],
  })
);

const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = "auto";
  refresh();
};

const addNewWarehouse = () => {
  showModal.value = true;
  document.body.style.overflow = "hidden";
};

const sortValue = ref("newest");
const filterByStatusValue = ref("all");

watch([sortValue, filterByStatusValue], () => {
  router.push({
    path: route.path,
    query: { sort: sortValue.value, status: filterByStatusValue.value },
  });
});

const sortedWarehouses = computed(() => {
  switch (sortValue.value) {
    case "newest":
      return data.value.data.sort((a, b) => {
        return (
          new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
        );
      });

    case "oldest":
      return data.value.data.sort((a, b) => {
        return (
          new Date(a.attributes.createdAt) - new Date(b.attributes.createdAt)
        );
      });

    case "name":
      return data.value.data.sort((a, b) => {
        return a.attributes.name.localeCompare(b.attributes.name);
      });

    case "freecapacity-asc":
      return data.value.data.sort((a, b) => {
        return (
          a.attributes.maximumCapacity -
          a.attributes.usedCapacity -
          (b.attributes.maximumCapacity - b.attributes.usedCapacity)
        );
      });

    case "freecapacity-desc":
      return data.value.data.sort((a, b) => {
        return (
          b.attributes.maximumCapacity -
          b.attributes.usedCapacity -
          (a.attributes.maximumCapacity - a.attributes.usedCapacity)
        );
      });

    default:
      return data.value.data.sort((a, b) => {
        return (
          new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
        );
      });
  }
});

const filteredWarehouses = computed(() => {
  switch (filterByStatusValue.value) {
    case "all":
      return sortedWarehouses.value;

    case "open":
      return sortedWarehouses.value.filter(
        (warehouse) => warehouse.attributes.status === "open"
      );

    case "full":
      return sortedWarehouses.value.filter(
        (warehouse) => warehouse.attributes.status === "full"
      );

    case "closed":
      return sortedWarehouses.value.filter(
        (warehouse) => warehouse.attributes.status === "closed"
      );

    case "empty":
      return sortedWarehouses.value.filter(
        (warehouse) => warehouse.attributes.status === "empty"
      );

    default:
      return sortedWarehouses.value;
  }
});

onMounted(() => {
  router.push({
    path: route.path,
    query: { sort: sortValue.value, status: filterByStatusValue.value },
  });

  if (route.query.sort) {
    sortValue.value = route.query.sort;
  }

  if (route.query.status) {
    filterByStatusValue.value = route.query.status;
  }
});
</script>

<style lang="scss" scoped>
.filter-wrapper {
  @apply flex flex-col;

  @screen md {
    @apply flex-row justify-start;
  }

  .select-wrapper {
    @apply mb-8;
    @apply flex flex-col;

    @screen md {
      @apply mr-8 mb-10;
    }

    span {
      @apply font-montserratMedium;
      @apply mb-2;
    }

    select {
      @apply bg-white border border-gray-300 rounded-md;
      @apply py-2 px-4;
      @apply min-w-[250px];
    }
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
