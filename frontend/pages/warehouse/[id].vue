<template>
  <section class="container">
    <h1>{{ data.data.attributes.name }}</h1>

    <SinglePageToggleButtons @togglePackages="togglePackages" />

    <button class="back-btn" @click="backToWarehouses">
      <IconBack />
      <span>{{ $t("backToBtn") }}</span>
    </button>

    <div v-if="!showPackages">
      <SinglePageWarehouseData :data="data.data" @refresh="refresh" />
    </div>

    <div v-if="showPackages">
      <SinglePagePackageList
        @refresh="refresh"
        :warehouse="data.data"
        :packages="data.data.attributes.packages.data"
        :key="data"
      />
    </div>
    <notifications position="bottom right" />
  </section>
</template>

<script setup>
definePageMeta({
  middleware: ["auth"],
});
const { findOne } = useStrapi();
const route = useRoute();
const router = useRouter();
const { locale } = useI18n();
const localePath = useLocalePath();

const { data, pending, refresh, error } = await useAsyncData(
  "singleWarehouse",
  () =>
    findOne("warehouses", route.params.id, {
      populate: ["packages"],
    })
);

const showPackages = ref(false);

const togglePackages = (val) => {
  showPackages.value = val;
};

const backToWarehouses = () => {
  router.push(localePath("/", locale.value));
};
</script>

<style scoped lang="scss">
.container {
  @apply flex flex-col;
  @apply max-w-screen-2xl w-full mx-auto;
  @apply py-10 px-8;

  & > h1 {
    @apply text-2xl font-montserratBold text-center mb-10;

    @screen sm {
      @apply text-4xl text-left;
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
