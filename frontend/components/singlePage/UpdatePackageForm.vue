<template>
  <form @submit.prevent="onSubmit">
    <label>{{ $t("update.name") }}</label>
    <input
      class="mb-4 border-black border"
      type="name"
      v-model="name"
      @focusout="checkName"
      :class="{ 'form-field-error': nameError }"
    />
    <div v-if="nameError" class="form-error">{{ $t("update.nameError") }}</div>

    <label>{{ $t("update.category") }}</label>
    <input
      class="mb-4 border-black border"
      type="text"
      v-model="category"
      @focusout="checkCategory"
      :class="{ 'form-field-error': categoryError }"
    />
    <div v-if="categoryError" class="form-error">{{ $t("update.categoryError") }}</div>

    <label>{{ $t("update.price") }}</label>
    <input
      class="mb-4 border-black border"
      type="number"
      v-model="price"
      @focusout="checkPrice"
      :class="{ 'form-field-error': priceError }"
      step=".01"
    />
    <div v-if="priceError" class="form-error">{{ $t("update.priceError") }}</div>

    <div v-if="serverError" class="form-error">{{ $t("serverError") }}</div>

    <button :disabled="nameError || categoryError || priceError">{{ $t("update.updateBtn") }}</button>
  </form>
</template>

<script setup>
import { useNotification } from "@kyvg/vue3-notification";

const { notify } = useNotification();
const i18n = useI18n();
const { update } = useStrapi();
const emit = defineEmits(["closeModal"]);
const { singlePackage } = defineProps(["singlePackage"]);

const name = ref(singlePackage.attributes.name);
const category = ref(singlePackage.attributes.category);
const price = ref(singlePackage.attributes.price);

const nameError = ref(false);
const categoryError = ref(false);
const priceError = ref(false);
const serverError = ref(false);

const checkName = () => {
  if (name.value === null || name.value === "") {
    nameError.value = true;
  } else {
    nameError.value = false;
  }
};

const checkCategory = () => {
  if (category.value === null || category.value === "") {
    categoryError.value = true;
  } else {
    categoryError.value = false;
  }
};

const checkPrice = () => {
  if (price.value === null || price.value === "") {
    priceError.value = true;
  } else {
    priceError.value = false;
  }
};

const onSubmit = async () => {
  checkName();
  checkCategory();
  checkPrice();
  if (nameError.value || categoryError.value || priceError.value) {
    return;
  }

  try {
    await update("packages", singlePackage.id, {
      name: name.value,
      category: category.value,
      price: price.value,
    });
    emit("closeModal");
  } catch (error) {
    serverError.value = true;
  }

  notify({
    text: i18n.t("package.updateNotification"),
    type: "success",
    duration: 1500,
  });
};
</script>

<style lang="scss" scoped>
h2 {
  @apply text-2xl font-montserratMedium mt-0;
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
