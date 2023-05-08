<template>
  <div class="filter-wrapper-main">
    <div class="filter-wrapper">
      <div class="select-wrapper">
        <span>Sort by</span>

        <select v-model="sortValue">
          <option value="newest">Newest</option>
          <option value="name">Name</option>
          <option value="id">ID</option>
          <option value="price-asc">Price ASC</option>
          <option value="price-desc">Price DESC</option>
        </select>
      </div>

      <div class="select-wrapper">
        <span>Filter by Category</span>

        <select v-model="filterByCategoryValue">
          <option value="all">all</option>
          <option :value="category" v-for="category in getAllCategories()">
            {{ category }}
          </option>
        </select>
      </div>
    </div>

    <div class="search-wrapper">
      <input
        type="serach"
        placeholder="Search by name or ID"
        v-model="searchValue"
        @input="search"
        class="search-wrapper__input"
        :class="{ 'search-wrapper__input--active': searchInputIsShown }"
      />

      <IconSearch @click="toggleSearchInput" />
    </div>
  </div>
  <!-- SEARCH INPUT & SORT -->
  <div v-if="packages.length === 0">no packages</div>
  <div v-if="packages.length > 0" class="packages-grid">
    <SinglePagePackageCard
      v-for="(singlePackage, index) in handlePaginationValue.paginatedData
        .value"
      :singlePackage="singlePackage"
      :key="singlePackage.id"
      :index="index"
      @refresh="emit('refresh')"
    />
  </div>

  <div class="pagination">
    <button class="pagination__button" @click="handlePaginationValue.backPage">
      prev
    </button>
    <button
      v-for="item in Math.ceil(
        handlePaginationValue.data.length / handlePaginationValue.perPage
      )"
      :key="item"
      :class="{ 'pagination__item--active': item == pageNum }"
      class="pagination__item"
      @click="() => handlePaginationValue.goToPage(item)"
    >
      {{ item }}
    </button>
    <button class="pagination__button" @click="handlePaginationValue.nextPage">
      next
    </button>
  </div>

  <button @click="showPopup" class="plus-btn"><IconPlus /></button>

  <div
    :class="{ 'popup--active': popupIsShown }"
    class="popup"
    @click="closePopup"
  >
    <div class="popup__content">
      <div class="popup__header">
        <h2>Add Packages</h2>
        <button @click="forceClosePopup">
          <IconClose />
        </button>
      </div>
      <div class="popup__body">
        <div class="popup__body__input">
          <label for="quantity">Quantity (max 20)</label>
          <input
            type="number"
            :class="{ 'form-field-error': quantity > 20 || quantity < 1 }"
            v-model="quantity"
          />
          <p class="form-error" v-if="quantity > 20 || quantity < 1">
            error happened
          </p>
        </div>
        <div class="popup__body__buttons">
          <button
            :disabled="quantity > 20 || quantity < 1"
            @click="addPackages"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import usePagination from "@/composables/usePagination";

const { packages, warehouse } = defineProps(["packages", "warehouse"]);
const emit = defineEmits(["refresh"]);
const { create, update } = useStrapi();

const quantity = ref(1);
const popupIsShown = ref(false);

const showPopup = () => {
  popupIsShown.value = true;
  document.body.style.overflow = "hidden";
};

const closePopup = ($event) => {
  const containingElement = document.querySelector(".popup__content");

  if (
    !containingElement.contains($event.target) ||
    !$event.target === containingElement
  ) {
    popupIsShown.value = false;
    document.body.style.overflow = "auto";
  }
};

const forceClosePopup = () => {
  popupIsShown.value = false;
  document.body.style.overflow = "auto";
};

const addPackages = async () => {
  const fetchedProducts = await useFetch(
    `https://fakestoreapi.com/products?limit=${quantity.value}`
  );

  popupIsShown.value = false;
  document.body.style.overflow = "auto";

  fetchedProducts.data.value.map(async (product) => {
    const obj = {
      name: product.title,
      price: product.price,
      quantity: 1,
      category: product.category,
      rate: product.rating.rate,
      countRates: product.rating.count,
      description: product.description,
      warehouse: warehouse.id,
    };

    try {
      await create("packages", obj);
    } catch (error) {
      console.log(error);
    }
  });

  try {
    await update("warehouses", warehouse.id, {
      usedCapacity: (warehouse.attributes.usedCapacity =
        warehouse.attributes.usedCapacity + quantity.value),
    });

    quantity.value = 1;

    emit("refresh");
  } catch (error) {
    console.log(error);
  }
};

const sortValue = ref("newest");
const filterByCategoryValue = ref("all");
const searchValue = ref("");

const getAllCategories = () => {
  const categories = [];

  packages.map((singlePackage) => {
    if (!categories.includes(singlePackage.attributes.category)) {
      categories.push(singlePackage.attributes.category);
    }
  });

  return categories;
};

const sortedPackages = computed(() => {
  switch (sortValue.value) {
    case "newest":
      return packages.sort((a, b) => {
        return (
          new Date(b.attributes.createdAt) - new Date(a.attributes.createdAt)
        );
      });
    case "name":
      return packages.sort((a, b) => {
        return a.attributes.name.localeCompare(b.attributes.name);
      });
    case "id":
      return packages.sort((a, b) => {
        return a.id - b.id;
      });
    case "price-asc":
      return packages.sort((a, b) => {
        return a.attributes.price - b.attributes.price;
      });
    case "price-desc":
      return packages.sort((a, b) => {
        return b.attributes.price - a.attributes.price;
      });
  }
});

const filteredPackages = computed(() => {
  if (filterByCategoryValue.value === "all") {
    return sortedPackages.value;
  } else {
    return sortedPackages.value.filter((singlePackage) => {
      return singlePackage.attributes.category === filterByCategoryValue.value;
    });
  }
});

const searchPackages = computed(() => {
  if (searchValue.value === "") {
    return filteredPackages.value;
  } else {
    return filteredPackages.value.filter((singlePackage) => {
      return singlePackage.attributes.name
        .toLowerCase()
        .includes(searchValue.value.toLowerCase());
    });
  }
});

const handlePaginationValue = usePagination(searchPackages);

const pageNum = ref(handlePaginationValue.page);

const searchInputIsShown = ref(false);

const toggleSearchInput = () => {
  searchInputIsShown.value = !searchInputIsShown.value;
};
</script>

<style scoped lang="scss">
.pagination {
  @apply flex justify-center items-center mt-6;

  &__button {
    @apply bg-white text-font rounded-md px-4 py-2;
    @apply transition-all duration-300 ease-in-out;
    @apply border border-font mx-4;

    &:hover {
      @apply bg-font text-white;
    }
  }

  &__item {
    @apply mx-2 font-montserrat;

    &--active {
      @apply font-montserratBold;
    }

    &:hover {
      @apply underline;
    }
  }
}
.filter-wrapper-main {
  @apply flex flex-col mb-10;

  @screen md {
    @apply flex-row justify-between;
  }
  .filter-wrapper {
    @apply flex flex-col;

    @screen lg {
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
  .search-wrapper {
    @apply flex items-center justify-center;

    @screen lg {
      @apply items-start mt-7;
    }

    &__input {
      @apply bg-white border border-gray-300 rounded-md;
      @apply py-2 px-4;
      @apply w-full mr-4;
      @apply opacity-100 pointer-events-none;
      @apply transition-all duration-300 ease-in-out;

      @screen lg {
        @apply opacity-0;
      }

      &--active {
        @apply opacity-100 pointer-events-auto;
      }
    }

    svg {
      @apply cursor-pointer;
      @screen lg {
        @apply mt-1 mr-10;
      }
    }
  }
}
.plus-btn {
  @apply mt-10 fixed bottom-6 right-8;
  @apply w-16 h-16;
  @apply shadow-lg bg-blue-100 rounded-full shadow-gray-500;
  @apply flex items-center justify-center;
}
.popup {
  @apply opacity-0 pointer-events-none;
  @apply fixed inset-0 -z-10 flex items-center justify-center;
  @apply transition-all duration-300 ease-in-out;
  @apply bg-black bg-opacity-50;

  &--active {
    @apply opacity-100 pointer-events-auto z-50;
  }

  &__content {
    @apply bg-white rounded-md p-8;
    @apply w-72;

    @screen sm {
      @apply w-96;
    }
  }

  &__header {
    @apply flex justify-between items-center mb-4;

    & > h2 {
      @apply text-xl font-montserratBold;

      @screen sm {
        @apply text-2xl;
      }
    }

    & > button {
      @apply text-2xl font-montserratBold;
    }
  }

  &__body {
    @apply flex flex-col;

    &__input {
      @apply flex flex-col mb-4;

      & > label {
        @apply mb-2;
      }

      & > input {
        @apply border border-gray-300 rounded-md p-2 mb-2;
      }
    }

    &__buttons {
      @apply flex justify-center;

      & > button {
        @apply bg-font text-white rounded-md px-4 py-2;
        @apply transition-all duration-300 ease-in-out;
        @apply border border-font;

        &:hover {
          @apply bg-white text-font;
        }
      }
    }
  }
}
.packages-grid {
  @apply grid grid-cols-1 gap-4;
}
</style>
