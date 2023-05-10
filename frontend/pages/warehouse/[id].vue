<template>
  <section class="container">
    <div class="container__header">
      <h1>{{ data.data.attributes.name }}</h1>

      <IconDelete @click="showDeletePopup" class="cursor-pointer" />
    </div>

    <SinglePageToggleButtons @togglePackages="togglePackages" />

    <button class="back-btn" @click="backToWarehouses">
      <IconBack />
      <span>{{ $t("backToBtn") }}</span>
    </button>

    <div v-if="!showPackages">
      <SinglePageWarehouseData
        :data="data.data"
        @refresh="refresh"
      />
    </div>

    <div v-if="showPackages">
      <SinglePagePackageList
        @refresh="refresh"
        :warehouse="data.data"
        :packages="data.data.attributes.packages.data"
        :key="data"
      />
    </div>
  </section>
  <notifications position="bottom right" />

  <div
    :class="{ 'popup--active': deletePopupIsShown }"
    class="popup"
    @click="closePopup"
  >
    <div class="popup__content-del">
      <div class="popup__header">
        <h2>{{ $t("wh-data.delete") }}</h2>
        <button @click="forceClosePopup">
          <IconClose />
        </button>
      </div>
      <div class="popup__body">
        <p>{{ $t("wh-data.deleteText") }}</p>

        <div class="popup__body__buttons">
          <button @click="forceClosePopup">
            {{ $t("package.cancelBtn") }}
          </button>

          <button @click="deletePackage" class="delete-btn">
            {{ $t("package.deleteBtn") }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useNotification } from "@kyvg/vue3-notification";

definePageMeta({
  middleware: ["auth"],
});

const { notify } = useNotification();
const i18n = useI18n();
const { findOne, delete: _delete } = useStrapi();
const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const localePath = useLocalePath();

const { data, pending, refresh, error } = await useAsyncData(
  "singleWarehouse",
  () =>
    findOne("warehouses", route.params.id, {
      populate: ["packages", "secondaryWarehouse"],
    })
);

const showPackages = ref(false);

const togglePackages = (val) => {
  showPackages.value = val;
};

const backToWarehouses = () => {
  router.push(localePath("/", locale.value));
};

const deletePopupIsShown = ref(false);

const showDeletePopup = () => {
  deletePopupIsShown.value = true;
  document.body.style.overflow = "hidden";
};

const deletePackage = async () => {
  await _delete("warehouses", data.value.data.id);
  deletePopupIsShown.value = false;
  document.body.style.overflow = "auto";
  router.push(localePath("/", locale.value));

  notify({
    text: i18n.t("wh-data.deleteNotification"),
    type: "error",
    duration: 1500,
  });
};

const closePopup = ($event) => {
  const containingElement = document.querySelector(".popup__content-del");

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
  @apply fixed inset-0 -z-10 flex items-center justify-center;
  @apply transition-all duration-300 ease-in-out;
  @apply bg-black bg-opacity-50;

  &--active {
    @apply opacity-100 pointer-events-auto z-50;
  }

  &__content-del {
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

.container {
  @apply flex flex-col;
  @apply max-w-screen-2xl w-full mx-auto;
  @apply py-10 px-8;

  &__header {
    @apply flex flex-col items-center mb-10;

    @screen sm {
      @apply flex-row justify-between items-center;
    }

    & > h1 {
      @apply text-2xl font-montserratBold text-center mb-6;

      @screen sm {
        @apply text-4xl text-left mb-0;
      }
    }
  }
}

.back-btn {
  @apply flex justify-start items-center mb-10;

  & > * {
    @apply mr-2;
  }

  & > span {
    @apply font-montserratMedium;

    &:hover {
      @apply underline;
    }
  }
}
</style>
