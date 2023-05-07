<template>
  <!-- SEARCH INPUT & SORT -->
  <div v-if="packages.length === 0">no packages</div>
  <div v-if="packages.length > 0" class="packages-grid">
    <SinglePagePackageCard
      v-for="(singlePackage, index) in packages"
      :singlePackage="singlePackage"
      :key="singlePackage.id"
      :index="index"
    />
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
          <input type="number" :class="{'form-field-error': quantity > 20 || quantity < 1}" v-model="quantity" />
          <p class="form-error" v-if="quantity > 20 || quantity < 1">error happened</p>
        </div>
        <div class="popup__body__buttons">
          <button :disabled="quantity > 20 || quantity < 1" @click="addPackages">Add</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { packages, warehouse } = defineProps(["packages", "warehouse"]);
const emit = defineEmits(["refresh"]);
const { create, update } = useStrapi();

const popupIsShown = ref(false);
const quantity = ref(1);
const quantityError = ref(false);

const showPopup = () => {
  popupIsShown.value = true;
  document.body.style.overflow = "hidden";
};

const closePopup = ($event) => {
  const containingElement = document.querySelector(".popup__content");

  if (!containingElement.contains($event.target)) {
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
</script>

<style scoped lang="scss">
.plus-btn {
  @apply mt-10 fixed bottom-6 right-8;
  @apply w-16 h-16;
  @apply shadow-lg bg-blue-100 rounded-full shadow-gray-500;
  @apply flex items-center justify-center;
}
.popup {
  @apply opacity-0 pointer-events-none;
  @apply fixed inset-0 z-50 flex items-center justify-center;
  @apply transition-all duration-300 ease-in-out;
  @apply bg-black bg-opacity-50;

  &--active {
    @apply opacity-100 pointer-events-auto;
  }

  &__content {
    @apply bg-white rounded-md p-8;
    @apply w-96;
  }

  &__header {
    @apply flex justify-between items-center mb-4;

    & > h2 {
      @apply text-2xl font-montserratBold;
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
