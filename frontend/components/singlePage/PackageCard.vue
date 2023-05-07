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
      <IconDelete />
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
</template>

<script setup>
const { singlePackage, index } = defineProps(["singlePackage", "index"]);
const emit = defineEmits(["refresh"]);

const showModal = ref(false);

const closeModal = () => {
  showModal.value = false;
  document.body.style.overflow = "auto";
  emit("refresh");
};
</script>

<style scoped lang="scss">
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
