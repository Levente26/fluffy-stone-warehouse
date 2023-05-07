<template>
  <div class="package-card" :class="{ 'package-card--even': index % 2 === 0 }">
    <div class="package-card__info">
      <div>
        <p class="mb-2">ID: {{ singlePackage.id }}</p>
        <h2>{{ singlePackage.attributes.name }}</h2>
        <div>
          <span>Price</span>
          <span>{{ singlePackage.attributes.price }} €</span>
        </div>
        <div>
          <span>Category</span>
          <span>{{ singlePackage.attributes.category }}</span>
        </div>
      </div>
    </div>
    <div class="package-card__crud">
      <IconEdit @click="showModal = true" />
      <IconDelete @click="showDeletePopup" />
    </div>
  </div>

  <section class="modal" :class="{ 'modal--active': showModal }">
    <div :class="{ 'modal--hidden-div': showModal }" @click="closeModal"></div>
    <div class="modal__form" :class="{ 'modal__form--active': showModal }">
      <div class="modal__top">
        <h2>Update Package</h2>

        <button @click="closeModal">
          <IconClose />
        </button>
      </div>

      <SinglePageUpdatePackageForm
        @closeModal="closeModal"
        :singlePackage="singlePackage"
      />
    </div>
  </section>

  <div
    :class="{ 'popup--active': deletePopupIsShown }"
    class="popup"
    @click="closePopup"
  >
    <div class="popup__content">
      <div class="popup__header">
        <h2>Delete Package</h2>
        <button @click="forceClosePopup">
          <IconClose />
        </button>
      </div>
      <div class="popup__body">
        <p>Are you sure you want to delete the selected package?</p>
        <div class="popup__body__buttons">
          <button @click="forceClosePopup">Cancel</button>
          <button @click="deletePackage" class="delete-btn">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { singlePackage, index } = defineProps(["singlePackage", "index"]);
const emit = defineEmits(["refresh"]);
const { delete: _delete } = useStrapi();

const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = "auto";
  emit("refresh");
};

const deletePopupIsShown = ref(false);

const showDeletePopup = () => {
  deletePopupIsShown.value = true;
  document.body.style.overflow = "hidden";
};

const deletePackage = async () => {
  await _delete("packages", singlePackage.id)
  deletePopupIsShown.value = false;
  document.body.style.overflow = "auto";
  emit("refresh");
};

const closePopup = ($event) => {
  const containingElement = document.querySelector(".popup__content");

  if (!containingElement.contains($event.target)) {
    deletePopupIsShown.value = false;
    document.body.style.overflow = "auto";
  }
};

const forceClosePopup = () => {
  deletePopupIsShown.value = false;
  document.body.style.overflow = "auto";
};
</script>

<style scoped lang="scss">
.delete-btn {
  @apply bg-red-700 border-red-700 #{!important};

  &:hover {
    @apply bg-white text-red-700 #{!important};
  }
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

    p {
      @apply my-4 font-montserratLight;
    }

    &__buttons {
      @apply flex justify-center;

      & > button {
        @apply bg-font text-white rounded-md px-4 py-2 mx-2;
        @apply transition-all duration-300 ease-in-out;
        @apply border border-font;

        &:hover {
          @apply bg-white text-font;
        }
      }
    }
  }
}
.package-card {
  @apply p-4 rounded-md w-full;
  @apply flex flex-col justify-between;

  @screen md {
    @apply flex-row items-center;
  }

  @screen lg {
    @apply px-10;
  }

  &--even {
    @apply bg-gray-100;
  }
  h2 {
    @apply font-montserratMedium mb-4;
  }

  &__crud {
    @apply flex justify-center items-center mt-6;

    @screen md {
      @apply mt-0;
    }

    & > * {
      @apply mx-4 cursor-pointer;

      &:hover {
        @apply transform scale-105;
        @apply transition-all duration-300;
      }
    }
  }

  &__info {
    div {
      @apply font-montserratLight text-sm mb-2;
      @apply flex flex-col;

      span {
        &:first-child {
          @apply mr-2;
        }

        &:last-child {
          @apply font-montserrat;
        }
      }
    }
  }
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
</style>
